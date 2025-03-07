import React from "react";
import { Box, Grow, Card } from "@mui/material";

interface VectorsProps {
    vectors: [][] | null;
}

const Vectors: React.FC<VectorsProps> = ({ vectors }) => {
    console.log("Vectors from Vectors Component: ", vectors !== null ? vectors[0] : null);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        setShow(true);
    }, []);

    return (
        <>
            {
                vectors !== null && (
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        {[0, 1, 2, 3].map((row) => (
                            <Box
                                key={row}
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    padding: 2,
                                    animation: 'slideLeft 60s linear infinite',
                                    '@keyframes slideLeft': {
                                        '0%': { transform: 'translateX(0)' },
                                        '100%': { transform: 'translateX(-50%)' }
                                    },
                                    '&:nth-of-type(even)': {
                                        animation: 'slideRight 60s linear infinite',
                                        '@keyframes slideRight': {
                                            '0%': { transform: 'translateX(-50%)' },
                                            '100%': { transform: 'translateX(0)' }
                                        }
                                    }
                                }}
                            >
                                {vectors[0].slice(row * 192, (row + 1) * 192).map((value: number, index: number) => (
                                    <Grow
                                        key={index}
                                        in={show}
                                        style={{ transformOrigin: '0 0 0' }}
                                        timeout={100 + index * 20}
                                    >
                                        <Card
                                            sx={{
                                                minWidth: 60,
                                                height: 60,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f5f5f5',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#e0e0e0',
                                                }
                                            }}
                                        >
                                            {value.toFixed(6)}
                                        </Card>
                                    </Grow>
                                ))}
                            </Box>
                        ))}
                    </Box>
                )
            }
        </>
    );
}

export default Vectors;