import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { 
    Box, 
    Typography, 
    Container, 
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
    Chip,
    Card, 
    CardContent, 
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';

// Define interfaces for the component
interface TokenGenerationData {
    token: string;
    probability: number;
    topCandidates: {
        token: string;
        probability: number;
    }[];
    attention: number[][][]; // [layer][head][position]
    hiddenStates: number[][];
}

interface GenerationData {
    prompt: string;
    generatedTokens: TokenGenerationData[];
    samplingInfo: {
        strategy: string;
        temperature: number;
        topP: number;
        topK: number;
    };
    contextUsage: {
        tokenPositions: number[];
        attentionScores: number[][];
    };
}

const Generation: React.FC = () => {
    // State management
    const [prompt, setPrompt] = useState<string>("Once upon a time in a land far away, there lived");
    const [generationData, setGenerationData] = useState<GenerationData | null>(null);
    const [comparisonData, setComparisonData] = useState<Record<string, GenerationData>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [viewType, setViewType] = useState<number>(0); // 0: step-by-step, 1: context, 2: sampling comparison
    
    // Generation parameters
    const [temperature, setTemperature] = useState<number>(0.7);
    const [topP, setTopP] = useState<number>(0.9);
    const [topK, setTopK] = useState<number>(40);
    const [samplingStrategy, setSamplingStrategy] = useState<string>("nucleus");
    const [maxTokens, setMaxTokens] = useState<number>(30);
    
    // Animation controls
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const animationRef = useRef<number | null>(null);
    const [animationSpeed, setAnimationSpeed] = useState<number>(1); // seconds per token
    
    // Fetch generation data from API
    const fetchGenerationData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate`, {
                prompt: prompt.trim(),
                temperature,
                top_p: topP,
                top_k: topK,
                max_tokens: maxTokens,
                sampling_strategy: samplingStrategy
            });
            setGenerationData(response.data);
            setCurrentStep(0);
            setIsAnimating(false);
        } catch (err) {
            setError('Failed to fetch generation data. Please try again.');
            console.error('Generation fetch error:', err);
        } finally {
            setLoading(false);
        }
    };
    
    // For comparing sampling strategies
    const fetchComparisonData = async () => {
        setLoading(true);
        setError('');
        
        try {
            const strategies = ["greedy", "nucleus", "beam"];
            const promises = strategies.map(strategy => 
                axios.post(`${process.env.REACT_APP_API_URL}/generate`, {
                    prompt: prompt.trim(),
                    temperature: strategy === "greedy" ? 0.0 : temperature,
                    top_p: strategy === "nucleus" ? topP : 1.0,
                    top_k: topK,
                    max_tokens: maxTokens,
                    sampling_strategy: strategy
                })
            );
            
            const results = await Promise.all(promises);
            const newComparisonData: Record<string, GenerationData> = {};
            
            strategies.forEach((strategy, index) => {
                newComparisonData[strategy] = results[index].data;
            });
            
            setComparisonData(newComparisonData);
        } catch (err) {
            setError('Failed to fetch comparison data. Please try again.');
            console.error('Comparison fetch error:', err);
        } finally {
            setLoading(false);
        }
    };
    
    // Animation control functions
    const startAnimation = () => {
        if (!generationData || currentStep >= generationData.generatedTokens.length) return;
        
        setIsAnimating(true);
        
        const animate = () => {
            setCurrentStep(prevStep => {
                const nextStep = prevStep + 1;
                
                if (nextStep >= generationData.generatedTokens.length) {
                    setIsAnimating(false);
                    return prevStep;
                }
                
                animationRef.current = setTimeout(animate, animationSpeed * 1000) as unknown as number;
                return nextStep;
            });
        };
        
        animationRef.current = setTimeout(animate, animationSpeed * 1000) as unknown as number;
    };
    
    const pauseAnimation = () => {
        if (animationRef.current !== null) {
            clearTimeout(animationRef.current);
            animationRef.current = null;
        }
        setIsAnimating(false);
    };
    
    const resetAnimation = () => {
        pauseAnimation();
        setCurrentStep(0);
    };
    
    const stepForward = () => {
        pauseAnimation();
        if (generationData && currentStep < generationData.generatedTokens.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const stepBackward = () => {
        pauseAnimation();
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    // Clean up animation when component unmounts
    useEffect(() => {
        return () => {
            if (animationRef.current !== null) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);
    
    // Initialize with mock data for development
    useEffect(() => {
        // Mock data for development
        const mockGeneratedTokens: TokenGenerationData[] = Array(20).fill(0).map((_, i) => ({
            token: ` ${['king', 'queen', 'dragon', 'wizard', 'castle', 'knight', 'magic', 'sword', 'adventure', 'journey'][i % 10]}`,
            probability: 0.1 + Math.random() * 0.5,
            topCandidates: Array(5).fill(0).map((_, j) => ({
                token: ` ${['king', 'queen', 'dragon', 'wizard', 'castle'][j]}`,
                probability: (0.9 - (j * 0.15)) * (Math.random() * 0.3 + 0.8)
            })),
            attention: Array(4).fill(0).map(() => 
                Array(8).fill(0).map(() => 
                    Array(i + 10).fill(0).map(() => Math.random())
                )
            ),
            hiddenStates: Array(768).fill(0).map(() => 
                Array(2).fill(0).map(() => Math.random() * 2 - 1)
            )
        }));
        
        const mockData: GenerationData = {
            prompt,
            generatedTokens: mockGeneratedTokens,
            samplingInfo: {
                strategy: samplingStrategy,
                temperature,
                topP,
                topK
            },
            contextUsage: {
                tokenPositions: Array(prompt.split(' ').length).fill(0).map((_, i) => i),
                attentionScores: Array(mockGeneratedTokens.length).fill(0).map(() => 
                    Array(prompt.split(' ').length).fill(0).map(() => Math.random())
                )
            }
        };
        
        setGenerationData(mockData);
    }, []);
    
    // Tab change handler
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setViewType(newValue);
    };
    
    // Render the step-by-step token generation view
    const renderStepByStepView = () => {
        if (!generationData) return null;
        
        const { generatedTokens } = generationData;
        const currentToken = generatedTokens[currentStep] || null;
        const generatedText = generatedTokens.slice(0, currentStep + 1).map(t => t.token).join('');
        
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Token-by-Token Generation
                </Typography>
                
                {/* Animation controls */}
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={resetAnimation}>
                            <RestartAltIcon />
                        </IconButton>
                        <IconButton onClick={stepBackward}>
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton onClick={isAnimating ? pauseAnimation : startAnimation} 
                            color={isAnimating ? "secondary" : "primary"}>
                            {isAnimating ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={stepForward}>
                            <SkipNextIcon />
                        </IconButton>
                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                            <Slider
                                value={currentStep}
                                min={0}
                                max={generatedTokens.length - 1}
                                step={1}
                                onChange={(_e, value) => {
                                    pauseAnimation();
                                    setCurrentStep(value as number);
                                }}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `Token ${value + 1}`}
                            />
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>Animation Speed:</Typography>
                        <Slider
                            value={animationSpeed}
                            min={0.2}
                            max={2}
                            step={0.1}
                            onChange={(_e, value) => setAnimationSpeed(value as number)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}s`}
                            sx={{ width: 200, mr: 2 }}
                        />
                        <Typography variant="caption">
                            {currentStep + 1} of {generatedTokens.length} tokens
                        </Typography>
                    </Box>
                </Paper>
                
                {/* Generated text visualization */}
                <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
                    <Typography variant="body1" gutterBottom>
                        <span style={{ color: '#1976d2' }}>{prompt}</span>
                        <span style={{ fontWeight: 'bold' }}>{generatedText}</span>
                    </Typography>
                    
                    {currentToken && (
                        <Box sx={{ mt: 2, p: 2, border: '1px dashed #1976d2', borderRadius: 1 }}>
                            <Typography variant="subtitle2">
                                Current token: <Chip label={currentToken.token} color="primary" />
                            </Typography>
                            <Typography variant="body2">
                                Probability: {(currentToken.probability * 100).toFixed(2)}%
                            </Typography>
                        </Box>
                    )}
                </Paper>
                
                {/* Top candidates for current token */}
                {currentToken && (
                    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Top alternative tokens:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {currentToken.topCandidates.map((candidate, idx) => (
                                <Chip
                                    key={idx}
                                    label={`${candidate.token} (${(candidate.probability * 100).toFixed(1)}%)`}
                                    variant={candidate.token === currentToken.token ? "filled" : "outlined"}
                                    color={candidate.token === currentToken.token ? "primary" : "default"}
                                />
                            ))}
                        </Box>
                    </Paper>
                )}
                
                {/* Attention visualization for current token */}
                {currentToken && (
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Attention Patterns:
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            overflowX: 'auto', 
                            py: 2, 
                            '&::-webkit-scrollbar': { height: '8px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#bdbdbd', borderRadius: '4px' }
                        }}>
                            {/* Simplified attention visualization */}
                            {Array.from({ length: prompt.split(' ').length + currentStep }).map((_, idx) => (
                                <Box 
                                    key={idx}
                                    sx={{ 
                                        minWidth: '40px',
                                        height: '40px',
                                        mx: 0.5,
                                        bgcolor: idx < prompt.split(' ').length ? '#bbdefb' : '#c8e6c9',
                                        border: '1px solid #90caf9',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(25, 118, 210, 0.3)',
                                            opacity: currentToken.attention[0][0][idx] || 0
                                        }
                                    }}
                                >
                                    {idx + 1}
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}
            </Box>
        );
    };

    // Render the context usage view
    const renderContextView = () => {
        if (!generationData) return null;
        
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Context Window Utilization
                </Typography>
                
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="body2" paragraph>
                        This visualization shows how the model utilizes its context window during generation.
                        Brighter colors indicate token positions that receive more attention.
                    </Typography>
                    
                    <Box sx={{ height: 300, mb: 3, border: '1px solid #e0e0e0' }}>
                        {/* Context window heatmap */}
                        <Box sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'row',
                            overflowX: 'auto',
                            position: 'relative'
                        }}>
                            {generationData.contextUsage.attentionScores[Math.min(currentStep, generationData.contextUsage.attentionScores.length - 1)].map((score, idx) => (
                                <Box 
                                    key={idx}
                                    sx={{ 
                                        flexGrow: 1,
                                        minWidth: '20px',
                                        height: '100%',
                                        bgcolor: `rgba(25, 118, 210, ${score})`,
                                        borderRight: '1px solid rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        '&:hover': {
                                            boxShadow: '0 0 0 2px #1976d2'
                                        }
                                    }}
                                    title={`Position ${idx + 1}: Attention score ${(score * 100).toFixed(2)}%`}
                                >
                                    {idx % 5 === 0 && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                position: 'absolute', 
                                                bottom: 0, 
                                                left: 0, 
                                                transform: 'rotate(-90deg)', 
                                                transformOrigin: 'left bottom',
                                                color: score > 0.5 ? '#fff' : '#000'
                                            }}
                                        >
                                            {idx + 1}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Current Step: {currentStep + 1}
                        </Typography>
                        <Slider
                            value={currentStep}
                            min={0}
                            max={generationData.generatedTokens.length - 1}
                            step={1}
                            onChange={(_e, value) => setCurrentStep(value as number)}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                        Context Distribution
                    </Typography>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ minWidth: 100 }}>
                                    {idx === 0 ? 'Recent' : idx === 3 ? 'Distant' : `Window ${idx + 1}`}:
                                </Typography>
                                <Box sx={{ 
                                    flexGrow: 1, 
                                    height: '20px', 
                                    bgcolor: `rgba(25, 118, 210, ${0.8 - idx * 0.2})`,
                                    borderRadius: '4px'
                                }} />
                                <Typography variant="caption" sx={{ ml: 1, minWidth: 50 }}>
                                    {Math.round((0.8 - idx * 0.15) * 100)}%
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Box>
        );
    };

    const getAverageProbability = (data: Record<string, GenerationData>) => {
        const totalProbabilities = Object.values(data).reduce((acc, strategy) => {
            return acc + strategy.generatedTokens.reduce((sum, token) => sum + token.probability, 0);
        }, 0);
        
        const totalTokens = Object.values(data).reduce((acc, strategy) => {
            return acc + strategy.generatedTokens.length;
        }, 0);
        
        return (totalProbabilities / totalTokens).toFixed(2);
    }

    // Render the sampling strategy comparison view
    const renderSamplingComparisonView = () => {
        const strategies = Object.keys(comparisonData);
        
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Sampling Strategy Comparison
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<CompareArrowsIcon />}
                        onClick={fetchComparisonData}
                        disabled={loading}
                    >
                        Compare Strategies
                    </Button>
                </Box>
                
                <Grid container spacing={2}>
                    {strategies.length === 0 ? (
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                                <Typography>
                                    Click "Compare Strategies" to see generations with different sampling methods
                                </Typography>
                            </Paper>
                        </Grid>
                    ) : (
                        strategies.map(strategy => (
                            <Grid item xs={12} md={4} key={strategy}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {strategy.charAt(0).toUpperCase() + strategy.slice(1)} Sampling
                                    </Typography>
                                    
                                    <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                                        {strategy === "greedy" && "Selects the most probable token at each step (temperature=0)"}
                                        {strategy === "nucleus" && `Samples from tokens with cumulative probability < ${topP}`}
                                        {strategy === "beam" && "Maintains multiple candidate sequences and selects the best"}
                                    </Typography>
                                    
                                    <Divider sx={{ my: 1 }} />
                                    
                                    <Box sx={{ 
                                        height: 200, 
                                        overflowY: 'auto', 
                                        bgcolor: '#f5f5f5', 
                                        p: 1, 
                                        borderRadius: 1,
                                        mb: 2
                                    }}>
                                        <Typography>
                                            <span style={{ color: '#1976d2' }}>{comparisonData[strategy]?.prompt}</span>
                                            <span>{comparisonData[strategy]?.generatedTokens.map(t => t.token).join('')}</span>
                                        </Typography>
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Statistics:
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">
                                                Tokens: {comparisonData[strategy]?.generatedTokens.length || 0}
                                            </Typography>
                                            <Typography variant="body2">
                                                Avg. prob: {getAverageProbability(comparisonData)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    )}
                </Grid>
                
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Sampling Parameters
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Typography gutterBottom>Temperature: {temperature}</Typography>
                            <Slider
                                value={temperature}
                                min={0.1}
                                max={1.5}
                                step={0.1}
                                onChange={(_e, value) => setTemperature(value as number)}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 0.1, label: '0.1' },
                                    { value: 0.7, label: '0.7' },
                                    { value: 1.5, label: '1.5' }
                                ]}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Higher values increase randomness
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Typography gutterBottom>Top-p (nucleus): {topP}</Typography>
                            <Slider
                                value={topP}
                                min={0.1}
                                max={1.0}
                                step={0.05}
                                onChange={(_e, value) => setTopP(value as number)}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 0.1, label: '0.1' },
                                    { value: 0.9, label: '0.9' },
                                    { value: 1.0, label: '1.0' }
                                ]}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Sample from tokens with cumulative probability below this value
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Typography gutterBottom>Top-k: {topK}</Typography>
                            <Slider
                                value={topK}
                                min={1}
                                max={100}
                                step={1}
                                onChange={(_e, value) => setTopK(value as number)}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 1, label: '1' },
                                    { value: 40, label: '40' },
                                    { value: 100, label: '100' }
                                ]}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Sample from only the top K most likely tokens
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        );
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Text Generation Visualization
                </Typography>
                
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        label="Input Prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button 
                            variant="contained" 
                            onClick={fetchGenerationData}
                            disabled={prompt.trim().length < 3 || loading}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                                    Generating...
                                </Box>
                            ) : 'Generate Text'}
                        </Button>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Strategy</InputLabel>
                                <Select
                                    value={samplingStrategy}
                                    label="Strategy"
                                    onChange={(e) => setSamplingStrategy(e.target.value)}
                                >
                                    <MenuItem value="greedy">Greedy</MenuItem>
                                    <MenuItem value="nucleus">Nucleus (top-p)</MenuItem>
                                    <MenuItem value="topk">Top-K</MenuItem>
                                    <MenuItem value="beam">Beam Search</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Max Tokens</InputLabel>
                                <Select
                                    value={maxTokens}
                                    label="Max Tokens"
                                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
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

                {generationData && !loading && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Tabs 
                            value={viewType} 
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ mb: 2 }}
                        >
                            <Tab label="Step-by-Step Generation" />
                            <Tab label="Context Window" />
                            <Tab label="Sampling Comparison" />
                        </Tabs>
                        
                        {viewType === 0 && renderStepByStepView()}
                        {viewType === 1 && renderContextView()}
                        {viewType === 2 && renderSamplingComparisonView()}
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default Generation;