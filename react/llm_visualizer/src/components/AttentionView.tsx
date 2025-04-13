import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    MenuItem
} from '@mui/material';

interface AttentionData {
    tokens: string[];
    attention: number[][][][]; // [layer][head][from_token][to_token]
}

const AttentionView: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('The quick brown fox jumps over the lazy dog');
    const [attentionData, setAttentionData] = useState<AttentionData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [viewType, setViewType] = useState<number>(0); // 0: heatmap, 1: multi-head, 2: layer-by-layer
    const [selectedLayer, setSelectedLayer] = useState<number>(0);
    const [selectedHead, setSelectedHead] = useState<number>(0);

    const filterSpecialTokens = (data: AttentionData): AttentionData => {
        // Find indices of tokens to keep (non-special tokens)
        const validIndices = data.tokens.reduce<number[]>((indices, token, id) => {
            if (token !== '[CLS]' && token !== '[SEP]') {
                indices.push(id);
            }
            return indices;
        }, []);

        // Filter tokens array
        const filteredTokens = validIndices.map(id => data.tokens[id]);

        // Filter attention matrices
        const filteredAttention = data.attention.map(layer =>
            layer.map(head => {
                // Filter both from_token and to_token dimensions
                return validIndices.map(fromIdx =>
                    validIndices.map(toIdx => head[fromIdx][toIdx])
                );
            })
        );

        return {
            tokens: filteredTokens,
            attention: filteredAttention
        };
    };

    const fetchAttentionData = async () => {
            setLoading(true);
            try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/attention`, {
                            text: prompt.trim()
                    });
                    const filteredData = filterSpecialTokens(response.data);
                    setAttentionData(filteredData);
                    setError('');
            } catch (err) {
                    setError('Failed to fetch attention data. Please try again.');
                    console.error('Attention data fetch error:', err);
            } finally {
                    setLoading(false);
            }
    };
    useEffect(() => {
        fetchAttentionData();
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setViewType(newValue);
    };

    const renderHeatmap = () => {
        if (!attentionData) return null;
        
        const layerData = attentionData.attention[selectedLayer][selectedHead];
        const tokens = attentionData.tokens;
        
        return (
            <Box sx={{ mt: 2, overflowX: 'auto' }}>
                <Typography variant="subtitle1" gutterBottom>
                    Attention Heatmap - Layer {selectedLayer + 1}, Head {selectedHead + 1}
                </Typography>
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: `auto ${tokens.map(() => '1fr').join(' ')}`,
                    gap: 1,
                    alignItems: 'center'
                }}>
                    {/* Header row with tokens */}
                    <Box></Box>
                    {tokens.map((token, id) => (
                        <Box 
                            key={`header-${id}`} 
                            sx={{ 
                                textAlign: 'center', 
                                fontWeight: 'bold',
                                transform: 'rotate(-45deg)',
                                transformOrigin: 'left bottom',
                                width: '100px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {token}
                        </Box>
                    ))}
                    
                    {/* Data rows */}
                    {layerData.map((row, fromIdx) => (
                        <React.Fragment key={`row-${fromIdx}`}>
                            {/* Row header */}
                            <Box sx={{ 
                                fontWeight: 'bold',
                                padding: '0.5rem',
                                textAlign: 'right'
                            }}>
                                {tokens[fromIdx]}
                            </Box>
                            
                            {/* Attention cells */}
                            {row.map((value, toIdx) => {
                                // Calculate color based on attention value
                                const intensity = Math.min(value * 5, 1); // Adjust multiplier for visibility
                                return (
                                    <Box 
                                        key={`cell-${fromIdx}-${toIdx}`}
                                        sx={{ 
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: `rgba(255, 0, 0, ${intensity})`,
                                            border: '1px solid #ccc',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: intensity > 0.5 ? '#fff' : '#000'
                                        }}
                                        title={`From "${tokens[fromIdx]}" to "${tokens[toIdx]}": ${value.toFixed(4)}`}
                                    >
                                        {value.toFixed(2)}
                                    </Box>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderMultiHeadView = () => {
        if (!attentionData) return null;
        
        const layerData = attentionData.attention[selectedLayer];
        const tokens = attentionData.tokens;
        const numHeads = layerData.length;
        
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Multi-Head Attention View - Layer {selectedLayer + 1}
                </Typography>
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(4, numHeads)}, 1fr)`,
                    gap: 2
                }}>
                    {layerData.map((headData, headIdx) => (
                        <Paper 
                            key={`head-${headIdx}`}
                            elevation={3}
                            sx={{ 
                                p: 2,
                                border: selectedHead === headIdx ? '2px solid blue' : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSelectedHead(headIdx)}
                        >
                            <Typography variant="subtitle2" align="center" gutterBottom>
                                Head {headIdx + 1}
                            </Typography>
                            <Box sx={{ 
                                height: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Simplified representation of attention patterns */}
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    {tokens.map((_, tokenIdx) => {
                                        const angle = (360 / tokens.length) * tokenIdx;
                                        const x = 50 + 40 * Math.cos(angle * Math.PI / 180);
                                        const y = 50 + 40 * Math.sin(angle * Math.PI / 180);
                                        
                                        return (
                                            <g key={`token-${tokenIdx}`}>
                                                <circle 
                                                    cx={x} 
                                                    cy={y} 
                                                    r={5} 
                                                    fill="blue"
                                                ><title>{_}</title></circle>
                                                {headData[tokenIdx].map((attention, toIdx) => {
                                                    if (attention > 0.1) { // Only show stronger connections
                                                        const toAngle = (360 / tokens.length) * toIdx;
                                                        const toX = 50 + 40 * Math.cos(toAngle * Math.PI / 180);
                                                        const toY = 50 + 40 * Math.sin(toAngle * Math.PI / 180);
                                                        
                                                        return (
                                                            <line 
                                                                key={`line-${tokenIdx}-${toIdx}`}
                                                                x1={x}
                                                                y1={y}
                                                                x2={toX}
                                                                y2={toY}
                                                                stroke="rgba(255,0,0,0.5)"
                                                                strokeWidth={Math.max(attention * 5, 0.5)}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </g>
                                        );
                                    })}
                                </svg>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderLayerView = () => {
        if (!attentionData) return null;
        
        const numLayers = attentionData.attention.length;
        
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Layer-by-Layer Attention Evolution
                </Typography>
                
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Selected Layer: {selectedLayer + 1}
                    </Typography>
                    <Slider
                        value={selectedLayer}
                        onChange={(_event, value) => setSelectedLayer(value as number)}
                        min={0}
                        max={numLayers - 1}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `Layer ${value + 1}`}
                    />
                </Paper>
                
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {attentionData.attention.map((layer, layerIdx) => (
                        <Paper 
                            key={`layer-${layerIdx}`}
                            elevation={3}
                            sx={{ 
                                p: 2,
                                opacity: layerIdx === selectedLayer ? 1 : 0.5,
                                border: layerIdx === selectedLayer ? '2px solid blue' : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSelectedLayer(layerIdx)}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                Layer {layerIdx + 1}
                            </Typography>
                            <Box sx={{ 
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 1,
                                overflowX: 'auto',
                                py: 1
                            }}>
                                {/* Show a simplified aggregated view of all heads in this layer */}
                                {attentionData.tokens.map((token, tokenIdx) => (
                                    <Box 
                                        key={`token-${tokenIdx}`}
                                        sx={{
                                            width: '40px',
                                            textAlign: 'center',
                                            position: 'relative'
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ display: 'block' }}>
                                            {token}
                                        </Typography>
                                        <Box sx={{
                                            height: '10px',
                                            backgroundColor: 'blue',
                                            width: '100%',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0.8) 100%)',
                                                opacity: layerIdx / numLayers
                                            }
                                        }} />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Attention Visualization
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
                            onClick={fetchAttentionData}
                            disabled={prompt.trim().length < 3 || loading}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                                    Processing...
                                </Box>
                            ) : 'Visualize Attention'}
                        </Button>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Layer</InputLabel>
                                <Select
                                    value={selectedLayer}
                                    label="Layer"
                                    onChange={(e) => setSelectedLayer(Number(e.target.value))}
                                    disabled={!attentionData}
                                >
                                    {attentionData && Array.from({ length: attentionData.attention.length }).map((_, id) => (
                                        <MenuItem key={`layer-${id}`} value={id}>Layer {id + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Head</InputLabel>
                                <Select
                                    value={selectedHead}
                                    label="Head"
                                    onChange={(e) => setSelectedHead(Number(e.target.value))}
                                    disabled={!attentionData}
                                >
                                    {attentionData && attentionData.attention[selectedLayer] && 
                                     Array.from({ length: attentionData.attention[selectedLayer].length }).map((_, id) => (
                                        <MenuItem key={`head-${id}`} value={id}>Head {id + 1}</MenuItem>
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

                {attentionData && !loading && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Tabs 
                            value={viewType} 
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ mb: 2 }}
                        >
                            <Tab label="Attention Heatmap" />
                            <Tab label="Multi-Head View" />
                            <Tab label="Layer-by-Layer View" />
                        </Tabs>
                        
                        {viewType === 0 && renderHeatmap()}
                        {viewType === 1 && renderMultiHeadView()}
                        {viewType === 2 && renderLayerView()}
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default AttentionView;