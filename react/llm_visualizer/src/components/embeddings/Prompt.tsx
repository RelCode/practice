import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface PromptProps {
    promptText: string;
}

const Prompt: React.FC<PromptProps> = ({ promptText }) => {
    return (
        <Box sx={{ width: '100%', maxWidth: 500, margin: '20px auto' }}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h4" color='primary' align='center' component="div">
                        {promptText}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Prompt;
