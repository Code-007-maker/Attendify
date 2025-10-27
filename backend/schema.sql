
CREATE DATABASE smart_attendance;
USE smart_attendance;

CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE class (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  section VARCHAR(10)
);

CREATE TABLE teacher (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  subject VARCHAR(100),
  class_id INT,
  FOREIGN KEY (class_id) REFERENCES class(id)
);

CREATE TABLE subject (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  class_id INT,
  teacher_id INT,
  FOREIGN KEY (class_id) REFERENCES class(id),
  FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);

CREATE TABLE student (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  roll_no INT,
  class_id INT,
  FOREIGN KEY (class_id) REFERENCES class(id)
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  teacher_id INT,
  class_id INT,
  subject_id INT,
  date DATE,
  status ENUM('Present', 'Absent'),
  FOREIGN KEY (student_id) REFERENCES student(id),
  FOREIGN KEY (teacher_id) REFERENCES teacher(id),
  FOREIGN KEY (class_id) REFERENCES class(id),
  FOREIGN KEY (subject_id) REFERENCES subject(id)
);
