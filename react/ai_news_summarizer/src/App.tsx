import React, { useState, useEffect } from 'react';
import { DotNetApi, FastApi, NodeApi, SelectedEndpoint } from './api';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, CircularProgress, Card, Typography } from '@mui/material';

const App : React.FC = () => {
	const [url, setUrl] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [summary, setSummary] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [response, setResponse] = useState<string>('');
	const [statusMsg, setStatusMsg] = useState<string | null>(null);
	const [selectedEndpoint, setSelectedEndpoint] = useState<SelectedEndpoint>(SelectedEndpoint.DotNet);

	const handleSummarize = async () => {
		setStatusMsg(null);
		if(!url && !text) {
			setStatusMsg('Please enter URL or Text');
			return;
		}
		const payload = (url && text) || text ? { text: text } : { text: url };
		setLoading(true);
		if(selectedEndpoint === SelectedEndpoint.DotNet){
			const response = await DotNetApi(payload);
		}else if(selectedEndpoint === SelectedEndpoint.FastApi){
			const response = await FastApi(payload);
			setLoading(false);
			if(response && response.data){
				setSummary(response.data.summary);
			}else if(response && response.error){
				setStatusMsg(response.error);
			}else{
				setStatusMsg("Error Occurred");
			}
		}else if(selectedEndpoint === SelectedEndpoint.Node){
			const response = await NodeApi(payload);
		}else{
			setLoading(false);
			setStatusMsg('Invalid Endpoint');
		}
	};

	const clearFields = () : void => {
		setUrl('');
		setText('');
	}

	return (
		<div className="App" style={{ padding: '20px' }}>
			<div style={{ maxWidth: '800px', margin: '0 auto' }}>
				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Select Endpoint</InputLabel>
					<Select
					value={selectedEndpoint}
					onChange={(e) => setSelectedEndpoint(e.target.value as SelectedEndpoint)}
					>
					{Object.values(SelectedEndpoint).map((endpoint) => (
						<MenuItem key={endpoint} value={endpoint}>
						{endpoint}
						</MenuItem>
					))}
					</Select>

					<TextField
						fullWidth
						sx={{ mb: 2 }}
						label="News URL"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>

					<TextField
						fullWidth
						sx={{ mb: 2 }}
						label="News Content"
						multiline
						rows={4}
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>

					<Button
						variant="contained"
						fullWidth
						onClick={handleSummarize}
						disabled={loading}
					>
						{loading ? <CircularProgress size={24} /> : 'Summarize'}
					</Button>
					{ statusMsg && (
						<Card sx={{ mt: 2, p: 2 }} style={{textAlign: 'center'}}>
							<Typography variant="h6">{statusMsg}</Typography>
						</Card>
					)}

					{summary && (
						<Card sx={{ mt: 2, p: 2 }}>
							<Typography variant="h6">Summary</Typography>
							<Typography>{summary}</Typography>
						</Card>
					)}
				</FormControl>
			</div>
		</div>
	)
}

export default App;
