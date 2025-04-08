import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box, 
  CircularProgress,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface EmbeddingModalProps {
  open: boolean;
  onClose: () => void;
  tokens: string[];
  selectedToken: string | null;
}

const EmbeddingModal: React.FC<EmbeddingModalProps> = ({ open, onClose, tokens, selectedToken }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [plotData, setPlotData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && tokens.length > 0) {
      setLoading(true);
      setError(null);
      
      axios.post(`${process.env.REACT_APP_API_URL}/visualize-embeddings`, {
        tokens: tokens
      })
      .then(response => {
        const { tokens: resultTokens, coordinates, user_tokens } = response.data;
        
        // Prepare colors - highlight selected token
        const backgroundColor = resultTokens.map((token: string, idx: number) => {
          if (token === selectedToken) return 'rgba(255, 0, 0, 1)';  // Selected token in red
          if (user_tokens && idx >= user_tokens) return 'rgba(150, 150, 150, 0.6)'; // Context tokens in gray
          return 'rgba(54, 162, 235, 0.8)';  // Regular tokens in blue
        });
        
        // Prepare point sizes
        const pointRadius = resultTokens.map((token: string) => 
          token === selectedToken ? 8 : 5
        );
        
        // Create scatter plot data
        setPlotData({
          datasets: [{
            label: 'Token Embeddings',
            data: coordinates.map((coord: number[], idx: number) => ({
              x: coord[0],
              y: coord[1],
              token: resultTokens[idx]
            })),
            backgroundColor,
            pointRadius
          }]
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching embedding visualization:', err);
        setError('Failed to generate visualization. Please try again.');
        setLoading(false);
      });
    }
  }, [open, tokens, selectedToken]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Embedding Visualization
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                This visualization shows how tokens relate to each other in semantic space
              </Typography>
              <Box sx={{ width: '100%', height: '400px' }}>
                <Scatter
                  data={plotData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: 'Dimension 1' } },
                      y: { title: { display: true, text: 'Dimension 2' } }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            const point = context.raw;
                            return point.token;
                          }
                        }
                      },
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 2, fontSize: '0.9rem', textAlign: 'center', maxWidth: '80%' }}>
                Tokens that appear close to each other in this 2D projection have similar meanings in the embedding space.
                {selectedToken && (
                  <> The red point represents <strong>"{selectedToken}"</strong>.</>
                )}
                {plotData && plotData.datasets[0].data.length > tokens.length && (
                  <> Gray points are common words added for context.</>
                )}
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmbeddingModal;