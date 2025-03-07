import React, { useState } from "react";
import { 
    Container, 
    Typography,
    Box 
} from "@mui/material";
import { Prompt, Tokens, Vectors } from "./embeddings/";
import axios from "axios";

const Embeddings: React.FC = () => {
    const [vectors, setVectors] = useState<[][] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const promptText = "This is our prompt";
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
    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4, position: 'relative' }}>
                <Typography variant="h4" gutterBottom>
                    Token Embeddings
                </Typography>
                <Prompt promptText={promptText} />
                <Tokens text={promptText} onTokenClick={onTokenClick} loading={loading} />
                <Vectors vectors={vectors} />
            </Box>
        </Container>
    );
}

export default Embeddings;