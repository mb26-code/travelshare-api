-- add a column "is_verified" to the "user_" table
ALTER TABLE user_ ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- table for storing temporary codes (password reset, email verification)
CREATE TABLE verification_code (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  code VARCHAR(10) NOT NULL, -- char alphanumeric code
  type ENUM('password_reset', 'email_verification') NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_verification_code PRIMARY KEY (id),
  CONSTRAINT fk_verification_code_user_id FOREIGN KEY (user_id) REFERENCES user_(id) ON DELETE CASCADE,
  INDEX idx_verification_code_user (user_id, type)
) ENGINE = InnoDB;

