-- TravelShare database schema definition script


SET FOREIGN_KEY_CHECKS = 0;
-- temporarily disabling constraints

DROP TABLE IF EXISTS report;
DROP TABLE IF EXISTS follow;
DROP TABLE IF EXISTS comment_;
DROP TABLE IF EXISTS like_;
DROP TABLE IF EXISTS photograph;
DROP TABLE IF EXISTS tagging;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS frame;
DROP TABLE IF EXISTS grouping_;
DROP TABLE IF EXISTS user_group;
DROP TABLE IF EXISTS user_;

SET FOREIGN_KEY_CHECKS = 1;
-- temporarily re-enabling constraints


-- database tables (DDL: Data Definition Language)


-- User entity
CREATE TABLE user_ (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  name_ VARCHAR(127) NOT NULL,
  profile_picture VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_user PRIMARY KEY (id),
  UNIQUE KEY uq_user_email (email)

  -- INDEX idx_user_email (email)
  -- note: UNIQUE KEY on 'email' automatically creates a unique index on this column so this previous index declaration is useless, would waste disk storage space, and would slightly slow inserts and updates
) ENGINE = InnoDB;


-- UserGroup entity
CREATE TABLE user_group (
  id INT NOT NULL AUTO_INCREMENT,
  name_ VARCHAR(127) NOT NULL,
  creator_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_user_group PRIMARY KEY (id),
  CONSTRAINT fk_user_group_creator_id FOREIGN KEY (creator_id) REFERENCES user_(id) ON DELETE SET NULL
) ENGINE = InnoDB;


-- association table/relation for storing/keeping track of _group members and their roles
CREATE TABLE grouping_ (
  user_group_id INT NOT NULL,
  user_id INT NOT NULL,
  
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_grouping PRIMARY KEY (user_group_id, user_id),
  CONSTRAINT fk_grouping_user_group_id FOREIGN KEY (user_group_id) REFERENCES user_group(id) ON DELETE CASCADE,
  CONSTRAINT fk_grouping_user_id FOREIGN KEY (user_id) REFERENCES user_(id) ON DELETE CASCADE,

  -- INDEX idx_grouping_user_group_id (user_group_id)
  -- note: PRIMARY KEY (user_group_id, user_id) automatically creates a composite index where the leftmost prefix (user_group_id) can be used for queries filtering by that attribute so this previous index declaration is useless, would waste disk storage space, and would slightly slow inserts and updates
  INDEX idx_grouping_user_id (user_id)
) ENGINE = InnoDB;


-- Frame entity (the posts/publications of the app)
CREATE TABLE frame (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL, -- the author of the frame/post
  size INT NOT NULL DEFAULT 1, -- how many photos are part of the frame
  title VARCHAR(127) NULL,
  description VARCHAR(4095) NULL,
  visibility enum('public', 'user_group', 'private') NOT NULL DEFAULT 'public',
  user_group_id INT NULL, -- if visibility is set to "user_group", for specifying which one
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_frame PRIMARY KEY (id),
  CONSTRAINT fk_frame_user_id FOREIGN KEY (user_id) REFERENCES user_(id) ON DELETE CASCADE,
  CONSTRAINT fk_frame_user_group_id FOREIGN KEY (user_group_id) REFERENCES user_group(id) ON DELETE SET NULL,

  INDEX idx_frame_user_id (user_id)
) ENGINE = InnoDB;


-- Tag entity (a content tag/a label describing content, like  #summer, #beach, or #island)
CREATE TABLE tag (
  id INT NOT NULL AUTO_INCREMENT,
  label VARCHAR(63) NOT NULL,
  
  CONSTRAINT pk_tag PRIMARY KEY (id),
  UNIQUE KEY uq_tag_label (label)

  -- INDEX idx_tag_label (label)
  -- note: UNIQUE KEY on 'label' automatically creates a unique index on this column so this previous index declaration is useless, would waste disk storage space, and would slightly slow inserts and updates
) ENGINE = InnoDB;


-- association table/relation for storing/keeping track of data between Frame and Tag entities (Tag --[tagging]-> Frame): a tagging applies to/qualifies the content of a Frame/post
CREATE TABLE tagging (
  tag_id INT NOT NULL,
  frame_id INT NOT NULL,

  CONSTRAINT pk_tagging PRIMARY KEY (frame_id, tag_id),
  CONSTRAINT fk_tagging_frame_id FOREIGN KEY (frame_id) REFERENCES frame(id) ON DELETE CASCADE,
  CONSTRAINT fk_tagging_tag_id FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
  
  -- INDEX idx_tagging_frame_id (frame_id),
  -- note: PRIMARY KEY (frame_id, tag_id) automatically creates a composite index where the leftmost prefix (frame_id) can be used for queries filtering by that attribute so this previous index declaration is useless, would waste disk storage space, and would slightly slow inserts and updates
  INDEX idx_tagging_tag_id (tag_id)
) ENGINE = InnoDB;


-- Photograph entity (a Frame is made of 1 or more Photograph entities)
CREATE TABLE photograph (
  id INT NOT NULL AUTO_INCREMENT,
  frame_id INT NOT NULL,
  order_ INT NOT NULL DEFAULT 0, -- the order/index of the photo within the frame (from 0 to n-1 when there are n photos)
  image VARCHAR(127) NOT NULL, -- stored and served by the back-end server

  latitude DOUBLE NULL,
  longitude DOUBLE NULL,

  CONSTRAINT pk_photograph PRIMARY KEY (id),
  CONSTRAINT fk_photograph_frame_id FOREIGN KEY (frame_id) REFERENCES frame(id) ON DELETE CASCADE,

  CONSTRAINT chk_photograph_latitude CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT chk_photograph_longitude CHECK (longitude BETWEEN -180 AND 180),

  INDEX idx_photograph_frame_id_order (frame_id, order_)
) ENGINE = InnoDB;


-- association table/relation for storing/keeping track of data between User and Frame entities (User --[like]-> Frame): a user likes a Frame/post
CREATE TABLE like_ (
  user_id INT NOT NULL,
  frame_id INT NOT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_like PRIMARY KEY (frame_id, user_id),
  CONSTRAINT fk_like_user_id FOREIGN KEY (user_id) REFERENCES user_(id) ON DELETE CASCADE,
  CONSTRAINT fk_like_frame_id FOREIGN KEY (frame_id) REFERENCES frame(id) ON DELETE CASCADE,

  -- INDEX idx_like_frame_id (frame_id),
  -- note: PRIMARY KEY (frame_id, user_id) automatically creates a composite index where the leftmost prefix (frame_id) can be used for queries filtering by that attribute so this previous index declaration is useless, would waste disk storage space, and would slightly slow inserts and updates
  INDEX idx_like_user_id (user_id)
) ENGINE = InnoDB;


-- association table/relation for storing/keeping track of data between User and Frame entities (User --[comment]-> Frame): a user comments on/under a Frame/post
CREATE TABLE comment_ (
  id INT NOT NULL AUTO_INCREMENT,

  user_id INT NOT NULL,
  frame_id INT NOT NULL,

  content VARCHAR(4095) NOT NULL,
  like_count INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  edited_at DATETIME NULL,

  CONSTRAINT pk_comment PRIMARY KEY (id),
  CONSTRAINT fk_comment_frame_id FOREIGN KEY (frame_id) REFERENCES frame(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_user_id FOREIGN KEY (user_id) REFERENCES user_(id) ON DELETE CASCADE,

  CONSTRAINT chk_comment_like_count CHECK (like_count > 0), -- is either NULL (ignored by check constraint) or a strictly positive integer

  INDEX idx_comment_frame_id (frame_id),
  INDEX idx_comment_user_id (user_id)
) ENGINE = InnoDB;


-- NotificationSubscription entity AND association relation for handling push notifications (FCM: Firebase Cloud Messaging)
-- association table/relation for storing/keeping track of notification subscription data between User and User/UserGroup/Tag entities
-- (User --[follow]-> User/UserGroup/Tag),
CREATE TABLE follow (
    id INT NOT NULL AUTO_INCREMENT,

    user_id INT NULL, -- which user should get notified (NULL = all users)
    trigger_object_type ENUM('user','user_group', 'tag') NULL, -- the type of subject that triggers a notification (NULL = undefined/global)
    trigger_object_id INT NULL, -- which subject triggers a notification (refers to valid id of the subject entity type)
    
    trigger_event_type ENUM('frame_post','other') NOT NULL, -- the type of event triggering a notification (for now, only for new posted frames)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- when the notification subscription was created/when the user expressed their wish to be notified about something


    CONSTRAINT pk_follow PRIMARY KEY (id),
    CONSTRAINT fk_follow_user_id FOREIGN KEY (user_id) REFERENCES user_(id) ON DELETE CASCADE,

    CONSTRAINT chk_follow_trigger_object CHECK (
      trigger_object_type IS NULL OR trigger_object_id IS NOT NULL
    ),

    INDEX idx_follow_user_id (user_id),
    INDEX idx_follow_trigger_object (trigger_object_type, trigger_object_id)
) ENGINE = InnoDB;


-- association table/relation for storing/keeping track of data between User and Frame entities User --[report]-> Frame), for handling user reports on frames (content moderation)
CREATE TABLE report (
  id INT NOT NULL AUTO_INCREMENT, -- report id

  user_id INT NOT NULL, -- user reporting the frame
  frame_id INT NOT NULL, -- reported frame post

  reason_type ENUM('spam','offensive','copyright','other') NOT NULL,
  reason VARCHAR(8191) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_report PRIMARY KEY (id),
  CONSTRAINT fk_report_frame_id FOREIGN KEY (frame_id) REFERENCES frame(id) ON DELETE CASCADE,
  CONSTRAINT fk_report_user_id FOREIGN KEY (user_id) REFERENCES user_(id) ON DELETE NO ACTION,

  INDEX idx_report_frame_id (frame_id),
  INDEX idx_report_user_id (user_id)
) ENGINE = InnoDB;