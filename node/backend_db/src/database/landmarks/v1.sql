-- Create the landmarks_native table
CREATE TABLE landmarks_native (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    landmark_name VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL
);

-- Create the landmark_images table
CREATE TABLE landmark_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    landmark_id INT NOT NULL,
    image_base64 LONGTEXT NOT NULL,
    FOREIGN KEY (landmark_id) REFERENCES landmarks_native(id) ON DELETE CASCADE
);