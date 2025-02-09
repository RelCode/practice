USE podman;

-- Create the tech_news table to store technology news data
CREATE TABLE IF NOT EXISTS tech_news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(100),
    url VARCHAR(255)
);

-- Populate the table with sample tech news entries
INSERT INTO tech_news (title, summary, published_at, source, url) VALUES
('New AI Breakthrough Achieved', 
 'Researchers have developed a new AI model that significantly surpasses current benchmarks in natural language processing.', 
 '2025-02-01 10:00:00', 
 'TechCrunch', 
 'https://techcrunch.com/ai-breakthrough'),

('Quantum Computing Reaches Milestone', 
 'A leading tech company has announced a quantum computer chip that brings us closer to practical quantum supremacy.', 
 '2025-01-25 14:30:00', 
 'Wired', 
 'https://wired.com/quantum-milestone'),

('5G Expansion Accelerates Globally', 
 'Major telecommunication companies are rapidly expanding their 5G networks, promising high-speed internet access worldwide.', 
 '2025-01-30 09:45:00', 
 'The Verge', 
 'https://theverge.com/5g-expansion'),

('Cybersecurity Threats on the Rise', 
 'A comprehensive study reveals that cybersecurity threats are increasing as more devices become connected to the internet.', 
 '2025-02-03 08:15:00', 
 'ZDNet', 
 'https://zdnet.com/cybersecurity-threats');