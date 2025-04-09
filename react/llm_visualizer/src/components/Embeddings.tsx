import React, { useState } from "react";
import { 
    Container, 
    Typography,
    Box,
    Button
} from "@mui/material";
import { Prompt, Tokens, Vectors, EmbeddingModal } from "./embeddings/";
import axios from "axios";

const Embeddings: React.FC = () => {
    const [vectors, setVectors] = useState<[][] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [tokenizedText, setTokenizedText] = useState<string[]>([]);
    const promptText = "The quick brown fox jumps over the lazy dog.";

    // Fetch tokens when component mounts
    React.useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/tokenize`, {
                    text: promptText
                });
                setTokenizedText(response.data.tokens);
            } catch (error) {
                console.error("Failed to tokenize text: ", error);
            }
        };
        
        fetchTokens();
    }, [promptText]);

    const onTokenClick = async (token: string, index: number) => {
        setLoading(true);
        setVectors(null);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/embeddings`, {
                tokens: [token]
            });
            setVectors(response.data?.embeddings[0]?.vectors[0]);
        } catch (error) {
            console.error("Failed to fetch token embeddings: ", error);
        } finally {
            setLoading(false);
        }
    }

    const openVisualization = () => {
        if (selectedToken) {
            setModalOpen(true);
        }
    };


    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4, position: 'relative' }}>
                <Typography variant="h4" gutterBottom>
                    Token Embeddings
                </Typography>
                <Prompt promptText={promptText} />
                <Tokens text={promptText} onTokenClick={onTokenClick} loading={loading} />
                
                {selectedToken && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">
                            Selected token: <strong>{selectedToken}</strong>
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={openVisualization}
                        >
                            Visualize Embedding
                        </Button>
                    </Box>
                )}
                
                <Vectors vectors={vectors} />
                
                <EmbeddingModal 
                    open={modalOpen} 
                    onClose={() => setModalOpen(false)} 
                    tokens={selectedToken ? [...tokenizedText] : []} 
                    selectedToken={selectedToken} 
                />
            </Box>
        </Container>
    );
}

export default Embeddings;