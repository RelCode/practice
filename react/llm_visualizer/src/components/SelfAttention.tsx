import React, { useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
interface AttentionCellProps {
    intensity: number;
}

const AttentionCell = styled(Paper)<AttentionCellProps>(({ theme, intensity }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `rgba(25, 118, 210, ${intensity})`
}));

interface SelfAttentionProps {
    tokens?: string[];
}

export const SelfAttention: React.FC<SelfAttentionProps> = () => { 
    const [selectedToken, setSelectedToken] = useState<number | null>(null);
    const tokens = ['I', 'love', 'machine', 'learning'];
    const attentionScores: Record<number, number[]> = {
        0: [0.4, 0.2, 0.2, 0.2],
        1: [0.2, 0.4, 0.2, 0.2],
        2: [0.2, 0.2, 0.4, 0.2],
        3: [0.2, 0.2, 0.2, 0.4],
    };

    return (
        <div style={{ width: '100%', textAlign: 'center' }}>
            {
                tokens.map((token, index) => (
                    <div style={{ width: '100px', height: '100px', display: 'flex', gap: '10px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '50%', justifyContent: 'center', alignItems: 'center' }}>
                        {token}
                    </div>
                ))
            }
        </div>
    );
};

export default SelfAttention;