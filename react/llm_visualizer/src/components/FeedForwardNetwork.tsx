import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Tabs,
    Tab,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Tooltip,
    Divider
} from '@mui/material';

interface FFNData {
    tokens: string[];
    // Intermediate activations in the hidden layer
    intermediate: number[][][]; // [layer][token][neuron]
    // After GELU activation
    activations: number[][][]; // [layer][token][neuron]
    // Final output after the second linear transformation
    output: number[][][]; // [layer][token][dim]
}

const FeedForwardNetwork: React.FC = () => {
const [prompt, setPrompt] = useState<string>('The quick brown fox jumps over the lazy dog');
const [ffnData, setFfnData] = useState<FFNData | null>(null);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>('');
const [viewType, setViewType] = useState<number>(0); // 0: neuron activations, 1: token representations, 2: layer comparison
const [selectedLayer, setSelectedLayer] = useState<number>(0);
const [selectedToken, setSelectedToken] = useState<number>(0);
const [selectedNeuron, setSelectedNeuron] = useState<number>(0);

const fetchFFNData = async () => {
    setLoading(true);
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/ffn-analysis`, {
            text: prompt.trim()
        });
        setFfnData(response.data);
        setError('');
    } catch (err) {
        setError('Failed to fetch feed-forward network data. Please try again.');
        console.error('FFN data fetch error:', err);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    // For demo purposes, initialize with mock data
    const mockData: FFNData = {
        tokens: prompt.split(/\s+/),
        intermediate: Array(12).fill(0).map(() => 
            Array(prompt.split(/\s+/).length).fill(0).map(() => 
                Array(768).fill(0).map(() => Math.random() * 2 - 1)
            )
        ),
        activations: Array(12).fill(0).map(() => 
            Array(prompt.split(/\s+/).length).fill(0).map(() => 
                Array(768).fill(0).map(() => Math.random())
            )
        ),
        output: Array(12).fill(0).map(() => 
            Array(prompt.split(/\s+/).length).fill(0).map(() => 
                Array(768).fill(0).map(() => Math.random() * 2 - 1)
            )
        ),
    };
    setFfnData(mockData);
}, []);

const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setViewType(newValue);
};

const renderNeuronActivations = () => {
    if (!ffnData) return null;
    
    const activationData = ffnData.activations[selectedLayer][selectedToken];
    const chartData = activationData.slice(0, 50).map((value, index) => ({
        neuron: index,
        activation: value
    }));
    
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Neuron Activations - Layer {selectedLayer + 1}, Token: "{ffnData.tokens[selectedToken]}"
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                This visualization shows the activation values for individual neurons in the feed-forward 
                network after applying the GELU activation function. High activation values indicate 
                neurons that strongly respond to specific features in the token representation.
            </Typography>
            
            <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="neuron" label={{ value: "Neuron Index", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Activation Value", angle: -90, position: "insideLeft" }} />
                        <RechartsTooltip />
                        <Bar 
                            dataKey="activation" 
                            fill="#8884d8" 
                            onClick={(data: { neuron: number; activation: number }) => setSelectedNeuron(data.neuron)}
                            isAnimationActive={false}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    About Feed-Forward Networks in Transformers
                </Typography>
                <Typography variant="body2" paragraph>
                    In transformer models, the feed-forward network (FFN) follows the multi-head attention mechanism
                    in each layer. It processes each token independently, applying the same transformation to each position.
                </Typography>
                <Typography variant="body2" paragraph>
                    The FFN consists of two linear transformations with a GELU activation function in between:
                    FFN(x) = GELU(xW₁ + b₁)W₂ + b₂
                </Typography>
                <Typography variant="body2">
                    The first transformation expands the representation to a higher dimension (typically 4x),
                    allowing the model to capture more complex patterns. The second transformation projects
                    back to the model's hidden dimension. This component helps the model capture relationships
                    that attention alone cannot model effectively.
                </Typography>
            </Paper>
        </Box>
    );
};

const renderTokenRepresentations = () => {
    if (!ffnData) return null;
    
    // Compare input and output representations for the selected token
    const inputData = ffnData.intermediate[selectedLayer][selectedToken];
    const outputData = ffnData.output[selectedLayer][selectedToken];
    
    // Create comparison data for visualization
    const comparisonData = inputData.slice(0, 20).map((input, idx) => ({
        index: idx,
        input: input,
        output: outputData[idx],
    }));
    
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Token Transformation - Layer {selectedLayer + 1}, Token: "{ffnData.tokens[selectedToken]}"
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                This chart compares the input representation of a token to its output after passing through
                the feed-forward network. The transformation highlights how the FFN modifies the token's features.
            </Typography>
            
            <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" label={{ value: "Feature Dimension", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="input" fill="#8884d8" name="Before FFN" />
                        <Bar dataKey="output" fill="#82ca9d" name="After FFN" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Function of FFN
                        </Typography>
                        <Typography variant="body2">
                            The feed-forward network acts as a non-linear feature detector, enhancing specific patterns
                            in the token representations. It can be thought of as a collection of specialized "experts"
                            where different neurons detect different linguistic features like syntax, semantics, or context-specific information.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Position-wise Processing
                        </Typography>
                        <Typography variant="body2">
                            Unlike attention which models relationships between tokens, the FFN processes each token position
                            independently with the same weights. This allows the model to apply consistent transformations
                            to token features regardless of their position in the sequence.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

const renderLayerComparison = () => {
    if (!ffnData) return null;
    
    // Compare activation patterns across layers for the selected token and neuron
    const layerData = ffnData.activations.map((layer, layerIdx) => ({
        layer: layerIdx + 1,
        activation: layer[selectedToken][selectedNeuron]
    }));
    
    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ height: 300, mb: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={layerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="layer" label={{ value: "Layer", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Activation Value", angle: -90, position: "insideLeft" }} />
                        <RechartsTooltip />
                        <Bar dataKey="activation" fill="#8884d8" name="Neuron Activation" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
                Layer-by-Layer Evolution - Token: "{ffnData.tokens[selectedToken]}", Neuron: {selectedNeuron}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                This visualization shows how a specific neuron's activation for a token evolves across different
                layers of the model. It helps understand how the representation changes as it moves deeper in the network.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Hierarchy of Features
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={idx}>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    p: 2, 
                                    textAlign: 'center',
                                    border: selectedLayer === idx ? '2px solid blue' : 'none',
                                    cursor: 'pointer',
                                    opacity: selectedLayer === idx ? 1 : 0.7
                                }}
                                onClick={() => setSelectedLayer(idx)}
                            >
                                <Typography variant="body2">Layer {idx + 1}</Typography>
                                <Box 
                                    sx={{ 
                                        height: '50px',
                                        background: 'linear-gradient(90deg, #e0f7fa 0%, #4dd0e1 100%)',
                                        mt: 1,
                                        borderRadius: 1,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(90deg, rgba(66,165,245,0.5) 0%, rgba(21,101,192,0.8) 100%)',
                                            clipPath: `polygon(0 0, ${(idx + 1) * 8.3}% 0, ${(idx + 1) * 8.3}% 100%, 0 100%)`
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                    Key Insights about Feed-Forward Networks
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="FFNs can be viewed as key-value memory structures where each token query accesses different 'memories' encoded in the network weights">
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Implicit Memory
                                </Typography>
                                <Typography variant="body2">
                                    Feed-forward networks function as a form of parametric memory, storing knowledge
                                    in their weights that can be retrieved based on the input representation.
                                </Typography>
                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Different neurons specialize in detecting different linguistic patterns or features">
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Specialization
                                </Typography>
                                <Typography variant="body2">
                                    Individual neurons in the FFN often specialize in detecting specific linguistic
                                    features, such as syntax patterns, semantic categories, or domain-specific concepts.
                                </Typography>
                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="FFNs complement attention by providing non-linear transformations that attention cannot achieve">
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Complementary to Attention
                                </Typography>
                                <Typography variant="body2">
                                    While attention layers model relationships between tokens, FFNs enhance individual
                                    token representations through complex non-linear transformations.
                                </Typography>
                            </Paper>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

return (
    <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Feed-Forward Network Visualization
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    label="Input Text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                        variant="contained" 
                        onClick={fetchFFNData}
                        disabled={prompt.trim().length < 3 || loading}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                                Processing...
                            </Box>
                        ) : 'Analyze Feed-Forward Network'}
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Layer</InputLabel>
                            <Select
                                value={selectedLayer}
                                label="Layer"
                                onChange={(e) => setSelectedLayer(Number(e.target.value))}
                                disabled={!ffnData}
                            >
                                {ffnData && Array.from({ length: ffnData.intermediate.length }).map((_, id) => (
                                    <MenuItem key={`layer-${id}`} value={id}>Layer {id + 1}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Token</InputLabel>
                            <Select
                                value={selectedToken}
                                label="Token"
                                onChange={(e) => setSelectedToken(Number(e.target.value))}
                                disabled={!ffnData}
                            >
                                {ffnData && ffnData.tokens.map((token, id) => (
                                    <MenuItem key={`token-${id}`} value={id}>{token}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Paper>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {ffnData && !loading && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Tabs 
                        value={viewType} 
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{ mb: 2 }}
                    >
                        <Tab label="Neuron Activations" />
                        <Tab label="Token Transformation" />
                        <Tab label="Layer Evolution" />
                    </Tabs>
                    
                    {viewType === 0 && renderNeuronActivations()}
                    {viewType === 1 && renderTokenRepresentations()}
                    {viewType === 2 && renderLayerComparison()}
                </Paper>
            )}
        </Box>
    </Container>
);
};

export default FeedForwardNetwork;