-- Mevcut veritabanını temizle
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+03:00";

-- Table schemas
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `login_attempts` int(11) NOT NULL DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` char(2) NOT NULL,
  `name` varchar(50) NOT NULL,
  `flag_icon` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_default` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_group` varchar(50) DEFAULT 'general',
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `social_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon_class` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `allergen_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon_name` varchar(50) DEFAULT NULL,
  `color_code` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `bg_color` varchar(20) DEFAULT NULL,
  `text_color` varchar(20) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'TRY',
  `image_url` varchar(255) DEFAULT NULL,
  `preparation_time` int(11) DEFAULT NULL,
  `calories` int(11) DEFAULT NULL,
  `serving_size` varchar(50) DEFAULT NULL,
  `spicy_level` int(11) DEFAULT 0,
  `is_vegetarian` tinyint(1) DEFAULT 0,
  `is_vegan` tinyint(1) DEFAULT 0,
  `is_gluten_free` tinyint(1) DEFAULT 0,
  `is_popular` tinyint(1) DEFAULT 0,
  `is_new` tinyint(1) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_allergens` (
  `product_id` int(11) NOT NULL,
  `allergen_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`allergen_id`),
  KEY `allergen_id` (`allergen_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `field_name` varchar(50) NOT NULL,
  `language_code` char(2) NOT NULL,
  `translation_text` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_translation` (`entity_type`,`entity_id`,`field_name`,`language_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Data
-- Dumping data for table `admin_users`
INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `salt`, `full_name`, `role`, `is_active`, `last_login`, `created_at`, `login_attempts`, `locked_until`) VALUES ('1', 'admin', 'admin@yedidegirmenler.com', '$2y$12$C9oVsWq50wlqmrKnPaw.u.bFLqF1oQiCF3LpyoV.V6yGBlMJ3PlyG', '', 'Sistem Yöneticisi', 'admin', '1', '2026-03-29 20:09:43', '2026-03-26 15:51:58', '0', NULL);

-- Dumping data for table `languages`
INSERT INTO `languages` (`id`, `code`, `name`, `is_active`, `is_default`) VALUES ('1', 'tr', 'Türkçe', '1', '1');
INSERT INTO `languages` (`id`, `code`, `name`, `is_active`, `is_default`) VALUES ('2', 'en', 'English', '1', '0');
INSERT INTO `languages` (`id`, `code`, `name`, `is_active`, `is_default`) VALUES ('3', 'ar', 'العربية', '1', '0');
INSERT INTO `languages` (`id`, `code`, `name`, `is_active`, `is_default`) VALUES ('4', 'ru', 'Русский', '1', '0');

-- Dumping data for table `site_settings`
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('1', 'site_title', 'Yedi Değirmenler Tabiat Parkı', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('2', 'site_subtitle', 'Kafe & Restorant', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('3', 'phone', '+90 462 000 00 00', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('4', 'site_logo', '/uploads/site_logo.1774782380.png', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('5', 'menu_layout', 'v2', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('6', 'primary_color', '#2C5F2D', 'color', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('7', 'secondary_color', '#d4a574', 'color', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('8', 'header_layout', 'centered', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('9', 'footer_text', 'Keyifli lezzetler dileriz.', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('10', 'header_opacity', '1', 'number', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('11', 'header_height', '120', 'number', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('12', 'footer_layout', '3', 'number', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('13', 'social_whatsapp', '', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('14', 'social_instagram', '', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('15', 'social_facebook', '', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('16', 'social_maps', '', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('17', 'google_font', 'Poppins', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('18', 'review_link', 'https://g.page/r/CUoJ9diyaVAGEBM/review', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('19', 'site_favicon', '/uploads/site_favicon.1774735403.png', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('20', 'footer_cta_text', 'Görüşleriniz Bizim İçin Önemli Bizi Değerlendirin.', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('21', 'footer_cta_link', 'https://g.page/r/CUoJ9diyaVAGEBM/review', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_editable`, `site_logo`, `site_favicon`, `out_of_stock_text`, `updated_by`, `created_at`, `updated_at`) VALUES ('22', 'footer_copyright', '© 2026 Yedideğirmenler. Tüm Hakları Saklıdır. Comyaz QR Menu', 'text', '1', NULL, NULL, NULL, '1', NULL, '2026-03-29 11:28:19');

-- Dumping data for table `allergen_types`
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('1', 'gluten', 'Gluten', '', '1', '1', NULL);
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('2', 'Milk and Dairy Products', 'Süt ve Süt Ürünleri', '', '2', '1', NULL);
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('3', 'eggs', 'Yumurta', '', '3', '1', NULL);
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('4', 'Sert kabuklu yemişler ', 'Sert kabuklu yemişler ', '', '0', '1', '');
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('5', 'Beef', 'Dana Eti', '', '0', '1', '');
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('6', 'Does Not Contain Gluten', 'Glutensiz  *Glutensiz hazırlanabilse de mutfak temasına bağlı iz içerebilir.', '', '0', '1', 'Although it can be prepared gluten-free, it may contain traces due to cross-contact in the kitchen.');
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('7', 'Corn', 'Mısır', '', '0', '1', '');
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('8', 'Lamb', 'Kuzu Eti', '', '0', '1', '');
INSERT INTO `allergen_types` (`id`, `code`, `name`, `icon_code`, `sort_order`, `is_active`, `description`) VALUES ('9', 'Tavuk Eti', 'Tavuk ', '', '0', '1', '');

-- Dumping data for table `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('10', 'Kahvaltı', 'kahvalti', '', '', '#2d5016', '1', '1', '/uploads/categories/category_10_1774792814.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('11', 'Çorba Çeşitleri', 'corba-cesitleri', '', '', '#2d5016', '8', '1', '/uploads/categories/category_11_1774792890.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('12', 'Köfte Yemekleri', 'kofte-yemekleri', '', '', '#2d5016', '3', '1', '/uploads/categories/category_12_1774792834.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('13', 'Et Yemekleri', 'et-yemekleri', '', '', '#2d5016', '4', '1', '/uploads/categories/category_13_1774792843.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('14', 'Pirzola', 'pirzola', '', '', '#2d5016', '2', '1', '/uploads/categories/category_14_1774792825.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('15', 'Tavuk Yemekleri', 'tavuk-yemekleri', '', '', '#2d5016', '5', '1', '/uploads/categories/category_15_1774792851.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('16', 'Special Izgara', 'special-izgara', '', '', '#2d5016', '7', '1', '/uploads/categories/category_16_1774792867.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('17', 'Tatlılar', 'tatlilar', '', '', '#2d5016', '9', '1', '/uploads/categories/category_17_1774792897.png', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('18', 'İçecekler', 'i-cecekler', '', '', '#2d5016', '10', '1', '/uploads/categories/category_18_1774792978.jpg', '1');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_code`, `color_code`, `sort_order`, `is_active`, `image`, `created_by`) VALUES ('19', 'Semaver Çay', 'semaver-cay', '', '', '#2d5016', '10', '1', '/uploads/categories/category_19_1774792904.png', '1');

-- Dumping data for table `products`
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('12', '10', 'Serpme Kahvaltı', 'serpme-kahvalti-87c7', '4 çeşit peynir, söğüş tabağı, zeytin çeşitleri, bal, tereyağı, 3 çeşit reçel, tereyağlı yumurta, patates kızartması, sosis, börek ve yanında sınırsız semaver çay ile zengin kahvaltı keyfi.
Servis bilgisi: Kişi başı 600 TL, minimum 2 kişilik sipariş verilmektedir.', '1200', '', '1', '0', 'products/product-12-1774791933.png', '', '2 Kişilik', '', '', '', '', '1', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('13', '10', 'Muhlama ( Kuymak )', 'kuymak-8ced', 'Tereyağı, özel peynir ve mısır unu ile hazırlanan sıcak ve uzayan yöresel lezzet.', '300', '', '1', '0', 'products/product-13-1774792031.png', '', '', '', '', '', '', '2', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('14', '10', 'Sucuklu Yumurta', 'sucuklu-yumurta-927c', 'Tavada pişirilen yumurta ve lezzetli sucuk dilimleriyle hazırlanan kahvaltı klasiği.', '250', '', '1', '0', 'products/product-14-1774792256.png', '', '', '', '', '', '', '4', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('15', '10', 'Menemen', 'menemen-98f6', 'Domates, biber ve yumurta ile hazırlanan, sıcak servis edilen geleneksel menemen.', '250', '', '1', '0', 'products/product-15-1774792098.png', '', '', '', '', '', '', '3', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('16', '10', 'Kavurmalı Yumurta', 'kavurmali-yumurta-a06d', 'Özenle pişirilmiş kavurma ve yumurtanın buluştuğu doyurucu kahvaltılık.', '260', '', '1', '0', 'products/product-16-1774792347.png', '', '', '', '', '', '', '6', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('17', '11', 'Mercimek Çorbası', 'mercimek-corbasi-ac94', 'Günün her saatine uygun, kıvamlı ve sıcak servis edilen klasik mercimek çorbası.', '150', '', '1', '0', 'products/product-17-1774789728.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('18', '11', 'Yöresel Lahana Çorbası', 'gunun-corbasi-b1c1', 'Karadeniz mutfağının sevilen lezzeti; lahana, yöresel malzemeler ve özel baharatlarla hazırlanan sıcak çorba.', '150', '', '1', '0', 'products/product-18-1774789725.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('19', '12', 'Porsiyon Köfte', 'porsiyon-kofte-bc82', 'Kuzu ve koyun etinden hazırlanan köfte; yanında pilav, patates kızartması ve ızgara sebze ile servis edilir.', '450', '', '1', '0', 'products/product-19-1774791254.png', '', '', '', '', '', '', '1', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('20', '12', 'KG Köfte', 'kg-kofte-c108', 'Paylaşımlık köfte servisi; yanında salata sunulur. Pilav ekstra olarak sipariş edile bilir.', '1600', '', '1', '0', 'products/product-20-1774791400.png', '', '1000 GR', '', '', '', '', '2', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('21', '13', 'Güveçte Et Sote', 'guvecte-et-sote-ca00', 'Lokum gibi pişen et, sebzeler ve özel sosuyla güveçte hazırlanır; sıcak servis edilir.', '550', '', '1', '0', 'products/product-21-1774790956.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('22', '13', 'Sac Kavurma', 'sac-kavurma-cfaa', 'Kuşbaşı etin sebzeler ve baharatlarla sac üzerinde pişirildiği bol lezzetli ana yemek.', '550', '', '1', '0', 'products/product-22-1774791054.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('23', '14', 'Kuzu Pirzola Porsiyon', 'kuzu-pirzola-porsiyon-dbc2', 'Özenle pişirilen kuzu pirzola; yanında pilav, patates kızartması ve ızgara sebze ile servis edilir.', '650', '', '1', '0', 'products/product-23-1774793278.png', '', '250GR', '', '', '', '', '1', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('24', '14', 'Yarım Kilo Pirzola', 'yarim-kilo-pirzola-e07a', 'Paylaşımlık kuzu pirzola servisi; yanında salata sunulur. Pilav ekstradır.', '1000', '', '1', '0', 'products/product-24-1774791774.png', '', '', '', '', '', '', '3', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('25', '14', 'KG Pirzola', 'bir-kg-pirzola-e4f1', 'Kalabalık sofralara uygun bol porsiyon kuzu pirzola; yanında salata sunulur. Pilav ekstradır.', '2000', '', '1', '0', 'products/product-25-1774793288.png', '', '1000 GR', '', '', '', '', '2', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('26', '15', 'Tavuk Izgara Porsiyon', 'tavuk-izgara-porsiyon-eef8', 'Izgarada özenle pişirilen tavuk; yanında pilav, patates kızartması ve ızgara sebze ile servis edilir.', '400', '', '1', '0', 'products/product-26-1774790127.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('27', '15', 'KG Tavuk Izgara', 'bir-kg-tavuk-izgara-f468', 'Paylaşımlık tavuk ızgara; kalabalık sofralar için ideal, sıcak ve taze servis edilir.', '900', '', '1', '0', 'products/product-27-1774789999.png', '', '1000 GR', '', '', '', '', '2', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('28', '15', 'Tavuk Sote', 'tavuk-sote-fa66', 'Sebzelerle birlikte sotelenen tavuk eti; yanında pilav, patates kızartması ve ızgara sebze ile servis edilir.', '450', '', '1', '0', 'products/product-28-1774790534.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('29', '16', 'Yedideğirmen Special Izgara', 'yedidegirmen-special-izgara-02af', '2 adet köfte, 2 adet tavuk ızgara, 1 tavuk şiş ve 2 adet kuzu pirzoladan oluşan özel karışık ızgara tabağı.', '1500', '', '1', '0', 'products/product-29-1774789838.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('30', '17', 'Sütlaç', 'sutlac-0e2f', 'Fırınlanmış kıvamlı sütlaç, üzeri fındık ile servis edilir.', '200', '', '1', '0', 'products/product-30-1774788799.png', '', '', '', '', '', '', '0', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('31', '18', 'Su', 'su-1690', 'Serinletici içme suyu.', '25', '', '1', '0', NULL, '', '', '', '', '', '', '-1', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('32', '18', 'Çay', 'cay-1b2e', 'Taze demlenmiş geleneksel Türk çayı.', '25', '', '1', '0', NULL, '', '', '', '', '', '', '1', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('33', '19', 'Küçük Semaver', 'kucuk-semaver-1fc2', 'Paylaşıma uygun, taze demlenmiş küçük boy semaver çay.', '250', '', '1', '0', 'products/product-33-1774789232.png', '', '', '', '', '', '', '1', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('34', '19', 'Orta Semaver', 'orta-semaver-2641', 'Aile ve arkadaş grupları için ideal orta boy semaver çay.', '350', '', '1', '0', 'products/product-34-1774789247.png', '', '', '', '', '', '', '2', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('35', '19', 'Büyük Semaver', 'buyuk-semaver-2be3', 'Kalabalık sofralara uygun büyük boy semaver çay.', '450', '', '1', '0', 'products/product-35-1774789215.png', '', '', '', '', '', '', '3', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('36', '18', '1 Litre Kola', '1-litre-kola-312c', 'Soğuk servis edilen 1 litre kola.', '120', '', '1', '0', 'products/product-36-1774789036.png', '', '', '', '', '', '', '3', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('37', '18', '1 Litre Sarı Kola', '1-litre-sari-kola-34f2', 'Soğuk servis edilen 1 litre portakallı gazlı içecek.', '120', '', '1', '0', 'products/product-37-1774788967.png', '', '', '', '', '', '', '4', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('38', '18', 'Kutu Kola', 'kutu-kola-3af6', 'Soğuk servis edilen kutu kola.', '100', '', '1', '0', NULL, '', '', '', '', '', '', '5', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('39', '18', 'Kutu Meyve Suyu', 'kutu-meyve-suyu-43ec', 'Çeşidine göre meyve aromalı, soğuk servis edilen kutu meyve suyu.', '100', '', '1', '0', NULL, '', '', '', '', '', '', '6', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('40', '18', 'Kutu Soğuk Çay', 'kutu-soguk-cay-498f', 'Ferahlatıcı, soğuk servis edilen kutu soğuk çay.', '100', '', '1', '0', NULL, '', '', '', '', '', '', '7', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('41', '18', 'Sade Soda', 'sade-soda-4e4d', 'Soğuk servis edilen sade maden suyu.', '60', '', '1', '0', NULL, '', '', '', '', '', '', '8', '', NULL, '1', NULL, '2026-03-29 12:17:53');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `is_available`, `is_featured`, `image_path`, `preparation_time`, `serving_size`, `calories`, `protein`, `fat`, `carbs`, `sort_order`, `out_of_stock_text`, `detailed_content`, `created_by`, `detailed_images`, `updated_at`) VALUES ('42', '18', 'Meyveli Soda', 'meyveli-soda-537c', 'Meyve aromalı, soğuk servis edilen maden suyu.', '70', '', '1', '0', NULL, '', '', '', '', '', '', '9', '', NULL, '1', NULL, '2026-03-29 12:17:53');

-- Dumping data for table `product_allergens`
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('7', '3', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('8', '3', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('9', '3', '3', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('10', '11', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('11', '11', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('12', '11', '3', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('13', '7', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('14', '7', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('15', '7', '3', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('35', '12', '4', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('36', '12', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('37', '12', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('38', '12', '3', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('42', '14', '5', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('43', '14', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('44', '14', '3', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('45', '15', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('46', '15', '3', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('47', '16', '5', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('48', '16', '3', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('49', '25', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('52', '24', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('53', '20', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('54', '20', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('55', '19', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('56', '19', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('57', '21', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('58', '22', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('59', '27', '9', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('60', '28', '9', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('61', '28', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('62', '26', '9', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('63', '26', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('64', '29', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('65', '29', '9', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('66', '29', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('67', '18', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('68', '18', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('69', '17', '1', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('70', '17', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('71', '30', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('72', '30', '4', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('73', '13', '6', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('74', '13', '7', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('75', '13', '2', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('76', '23', '8', 'trace');
INSERT INTO `product_allergens` (`id`, `product_id`, `allergen_id`, `severity`) VALUES ('77', '23', '1', 'trace');

-- Dumping data for table `translations`
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('683', 'en', 'category', '10', 'name', 'Breakfast');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('684', 'en', 'category', '11', 'name', 'Soups');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('685', 'en', 'category', '12', 'name', 'Meatball Dishes');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('686', 'en', 'category', '13', 'name', 'Meat Dishes');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('687', 'en', 'category', '14', 'name', 'Chops');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('688', 'en', 'category', '15', 'name', 'Chicken Dishes');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('689', 'en', 'category', '16', 'name', 'Special Grills');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('690', 'en', 'category', '17', 'name', 'Desserts');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('691', 'en', 'category', '18', 'name', 'Drinks');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('692', 'en', 'category', '19', 'name', 'Samovar Tea');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('693', 'en', 'product', '12', 'name', 'Traditional Spread Breakfast');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('694', 'en', 'product', '12', 'description', 'A lavish breakfast experience featuring 4 types of cheese, a fresh vegetable medley, assorted olives, honey, butter, 3 types of jam, eggs with butter, french fries, sausage, savory pastry (börek), and unlimited samovar tea. Serving information: 600 TL per person, minimum order for 2.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('695', 'en', 'product', '12', 'serving_size', 'For 2 People');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('696', 'en', 'product', '13', 'name', 'Kuymak (Melted Cheese and Cornmeal)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('697', 'en', 'product', '13', 'description', 'A hot, stretchy, and regional delicacy prepared with butter, special cheese, and cornmeal.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('698', 'en', 'product', '14', 'name', 'Spicy Turkish Sausage with Eggs');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('699', 'en', 'product', '14', 'description', 'A breakfast classic prepared with pan-fried eggs and delicious slices of spicy Turkish sausage (sucuk).');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('700', 'en', 'product', '15', 'name', 'Menemen (Turkish Scrambled Eggs)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('701', 'en', 'product', '15', 'description', 'A traditional menemen prepared with tomatoes, peppers, and eggs, served hot.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('702', 'en', 'product', '16', 'name', 'Kavurma (Sautéed Lamb) with Eggs');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('703', 'en', 'product', '16', 'description', 'A hearty and filling breakfast dish where carefully cooked Kavurma (sautéed lamb) meets eggs.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('704', 'en', 'product', '17', 'name', 'Lentil Soup');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('705', 'en', 'product', '17', 'description', 'A classic lentil soup, rich and served hot, perfect for any time of day.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('706', 'en', 'product', '18', 'name', 'Traditional Black Sea Cabbage Soup');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('707', 'en', 'product', '18', 'description', 'A beloved flavor of Black Sea cuisine; a hot soup prepared with cabbage, local ingredients, and special spices.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('708', 'en', 'product', '19', 'name', 'Meatball Plate');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('709', 'en', 'product', '19', 'description', 'Meatballs prepared from lamb and mutton; served with rice, french fries, and grilled vegetables.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('710', 'en', 'product', '20', 'name', 'KG Meatballs');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('711', 'en', 'product', '20', 'description', 'Shareable meatball service; served with salad. Rice can be ordered as an extra.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('712', 'en', 'product', '20', 'serving_size', '1000 GR');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('713', 'en', 'product', '21', 'name', 'Clay Pot Beef Sauté');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('714', 'en', 'product', '21', 'description', 'Tender meat, cooked with vegetables and a special sauce in a clay pot; served hot.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('715', 'en', 'product', '22', 'name', 'Sac Kavurma');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('716', 'en', 'product', '22', 'description', 'A very flavorful main course where diced meat is cooked with vegetables and spices on a ''sac'' griddle.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('717', 'en', 'product', '23', 'name', 'Lamb Chop Plate');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('718', 'en', 'product', '23', 'description', 'Carefully cooked lamb chops; served with rice, french fries, and grilled vegetables.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('719', 'en', 'product', '23', 'serving_size', '250GR');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('720', 'en', 'product', '24', 'name', 'Half Kilogram Lamb Chops');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('721', 'en', 'product', '24', 'description', 'Shareable lamb chops service; served with salad. Rice is extra.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('722', 'en', 'product', '25', 'name', 'KG Lamb Chops');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('723', 'en', 'product', '25', 'description', 'Generous portion of lamb chops suitable for large tables; served with salad. Rice is extra.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('724', 'en', 'product', '25', 'serving_size', '1000 GR');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('725', 'en', 'product', '26', 'name', 'Grilled Chicken Plate');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('726', 'en', 'product', '26', 'description', 'Carefully grilled chicken; served with rice, french fries, and grilled vegetables.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('727', 'en', 'product', '27', 'name', 'KG Grilled Chicken');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('728', 'en', 'product', '27', 'description', 'Shareable grilled chicken; ideal for large tables, served hot and fresh.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('729', 'en', 'product', '27', 'serving_size', '1000 GR');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('730', 'en', 'product', '28', 'name', 'Chicken Sauté');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('731', 'en', 'product', '28', 'description', 'Chicken meat sautéed with vegetables; served with rice, french fries, and grilled vegetables.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('732', 'en', 'product', '29', 'name', 'Yedideğirmen Special Grill');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('733', 'en', 'product', '29', 'description', 'A special mixed grill platter consisting of 2 meatballs, 2 grilled chicken pieces, 1 chicken shish, and 2 lamb chops.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('734', 'en', 'product', '30', 'name', 'Rice Pudding');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('735', 'en', 'product', '30', 'description', 'Oven-baked creamy rice pudding, served topped with hazelnuts.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('736', 'en', 'product', '31', 'name', 'Water');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('737', 'en', 'product', '31', 'description', 'Refreshing drinking water.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('738', 'en', 'product', '32', 'name', 'Turkish Tea');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('739', 'en', 'product', '32', 'description', 'Freshly brewed traditional Turkish tea.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('740', 'en', 'product', '33', 'name', 'Small Samovar Tea');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('741', 'en', 'product', '33', 'description', 'Freshly brewed small samovar tea, perfect for sharing.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('742', 'en', 'product', '34', 'name', 'Medium Samovar Tea');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('743', 'en', 'product', '34', 'description', 'Medium samovar tea, ideal for families and groups of friends.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('744', 'en', 'product', '35', 'name', 'Large Samovar Tea');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('745', 'en', 'product', '35', 'description', 'Large samovar tea, suitable for big tables and gatherings.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('746', 'en', 'product', '36', 'name', '1 Liter Cola');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('747', 'en', 'product', '36', 'description', '1 liter cola, served chilled.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('748', 'en', 'product', '37', 'name', '1 Liter Orange Soda');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('749', 'en', 'product', '37', 'description', '1 liter orange-flavored carbonated drink, served chilled.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('750', 'en', 'product', '38', 'name', 'Canned Cola');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('751', 'en', 'product', '38', 'description', 'Canned cola, served chilled.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('752', 'en', 'product', '39', 'name', 'Canned Fruit Juice');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('753', 'en', 'product', '39', 'description', 'Assorted fruit-flavored canned juice, served chilled.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('754', 'en', 'product', '40', 'name', 'Canned Iced Tea');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('755', 'en', 'product', '40', 'description', 'Refreshing canned iced tea, served chilled.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('756', 'en', 'product', '41', 'name', 'Plain Mineral Water');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('757', 'en', 'product', '41', 'description', 'Plain mineral water, served chilled.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('758', 'en', 'product', '42', 'name', 'Fruit Soda');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('759', 'en', 'product', '42', 'description', 'Fruit-flavored mineral water, served chilled.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('760', 'en', 'allergen', '1', 'name', 'Gluten');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('761', 'en', 'allergen', '2', 'name', 'Dairy');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('762', 'en', 'allergen', '3', 'name', 'Egg');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('763', 'en', 'allergen', '4', 'name', 'Tree Nuts');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('764', 'en', 'allergen', '5', 'name', 'Beef');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('765', 'en', 'allergen', '6', 'name', 'Gluten-Free *While prepared gluten-free, it may contain traces due to kitchen cross-contamination.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('766', 'en', 'allergen', '7', 'name', 'Corn');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('767', 'en', 'allergen', '8', 'name', 'Lamb');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('768', 'en', 'allergen', '9', 'name', 'Chicken');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('769', 'en', 'setting', '1', 'site_title', 'Seven Mills Nature Park');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('770', 'en', 'setting', '2', 'site_subtitle', 'Cafe & Restaurant');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('771', 'ar', 'category', '10', 'name', 'الإفطار');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('772', 'ar', 'category', '11', 'name', 'أنواع الحساء');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('773', 'ar', 'category', '12', 'name', 'أطباق الكفتة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('774', 'ar', 'category', '13', 'name', 'أطباق اللحوم');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('775', 'ar', 'category', '14', 'name', 'ريش');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('776', 'ar', 'category', '15', 'name', 'أطباق الدجاج');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('777', 'ar', 'category', '16', 'name', 'مشاوي خاصة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('778', 'ar', 'category', '17', 'name', 'الحلويات');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('779', 'ar', 'category', '18', 'name', 'المشروبات');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('780', 'ar', 'category', '19', 'name', 'شاي السماور');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('781', 'ar', 'product', '12', 'name', 'إفطار متنوع (سربمة)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('782', 'ar', 'product', '12', 'description', 'استمتع بوجبة إفطار غنية تضم 4 أنواع من الجبن، طبق خضروات ومقبلات باردة، تشكيلة زيتون، عسل، زبدة، 3 أنواع من المربى، بيض بالزبدة، بطاطس مقلية، سجق، بوراك، بالإضافة إلى شاي سماور غير محدود.
ملاحظة الخدمة: 600 ليرة تركية للشخص الواحد، الحد الأدنى للطلب شخصان.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('783', 'ar', 'product', '12', 'serving_size', 'لشخصين');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('784', 'ar', 'product', '13', 'name', 'محلمة (كويماك)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('785', 'ar', 'product', '13', 'description', 'طبق محلي ساخن ومطاطي محضر من الزبدة، الجبن الخاص ودقيق الذرة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('786', 'ar', 'product', '14', 'name', 'بيض بالسجق');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('787', 'ar', 'product', '14', 'description', 'طبق إفطار كلاسيكي محضر من البيض المقلي وشرائح السجق اللذيذة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('788', 'ar', 'product', '15', 'name', 'منمن');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('789', 'ar', 'product', '15', 'description', 'منمن تقليدي محضر من الطماطم والفلفل والبيض، يقدم ساخناً.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('790', 'ar', 'product', '16', 'name', 'بيض بالقاورما');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('791', 'ar', 'product', '16', 'description', 'وجبة إفطار مشبعة تجمع بين القاورما المطبوخة بعناية والبيض.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('792', 'ar', 'product', '17', 'name', 'شوربة العدس');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('793', 'ar', 'product', '17', 'description', 'شوربة العدس الكلاسيكية، مناسبة لكل الأوقات، تقدم دسمة وساخنة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('794', 'ar', 'product', '18', 'name', 'شوربة الملفوف المحلية');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('795', 'ar', 'product', '18', 'description', 'المذاق المفضل لمطبخ البحر الأسود؛ شوربة ساخنة محضرة من الملفوف ومكونات محلية وبهارات خاصة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('796', 'ar', 'product', '19', 'name', 'كفتة (حصة)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('797', 'ar', 'product', '19', 'description', 'كفتة محضرة من لحم الغنم والضأن؛ تُقدم مع الأرز والبطاطس المقلية والخضروات المشوية.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('798', 'ar', 'product', '20', 'name', 'كفتة بالكيلو');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('799', 'ar', 'product', '20', 'description', 'خدمة كفتة للمشاركة؛ تُقدم مع سلطة جانبية. يمكن طلب الأرز بشكل إضافي.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('800', 'ar', 'product', '20', 'serving_size', '1000 جرام');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('801', 'ar', 'product', '21', 'name', 'لحم سوتيه في الفخار');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('802', 'ar', 'product', '21', 'description', 'لحم مطهو حتى يصبح طريًا كالملبن، يُحضّر في طاجن مع الخضروات وصلصة خاصة؛ يُقدم ساخنًا.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('803', 'ar', 'product', '22', 'name', 'قاورما الصاج');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('804', 'ar', 'product', '22', 'description', 'طبق رئيسي غني بالنكهة، يُطهى فيه اللحم المكعبات على الصاج مع الخضروات والبهارات.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('805', 'ar', 'product', '23', 'name', 'ريش غنم (حصة)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('806', 'ar', 'product', '23', 'description', 'ريش غنم مطهوة بعناية؛ تُقدم مع الأرز والبطاطس المقلية والخضروات المشوية.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('807', 'ar', 'product', '23', 'serving_size', '250 جرام');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('808', 'ar', 'product', '24', 'name', 'نصف كيلو ريش');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('809', 'ar', 'product', '24', 'description', 'خدمة ريش غنم للمشاركة؛ تُقدم مع سلطة جانبية. الأرز يُطلب بشكل إضافي.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('810', 'ar', 'product', '25', 'name', 'ريش بالكيلو');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('811', 'ar', 'product', '25', 'description', 'كمية وفيرة من ريش الغنم مناسبة للموائد الكبيرة؛ تُقدم مع سلطة جانبية. الأرز يُطلب بشكل إضافي.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('812', 'ar', 'product', '25', 'serving_size', '1000 جرام');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('813', 'ar', 'product', '26', 'name', 'دجاج مشوي (حصة)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('814', 'ar', 'product', '26', 'description', 'دجاج مشوي بعناية على الشواية؛ يُقدم مع الأرز والبطاطس المقلية والخضروات المشوية.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('815', 'ar', 'product', '27', 'name', 'دجاج مشوي بالكيلو');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('816', 'ar', 'product', '27', 'description', 'دجاج مشوي للمشاركة؛ مثالي للموائد الكبيرة، يُقدم ساخنًا وطازجًا.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('817', 'ar', 'product', '27', 'serving_size', '1000 جرام');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('818', 'ar', 'product', '28', 'name', 'دجاج سوتيه');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('819', 'ar', 'product', '28', 'description', 'لحم دجاج سوتيه مع الخضروات؛ يُقدم مع الأرز والبطاطس المقلية والخضروات المشوية.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('820', 'ar', 'product', '29', 'name', 'مشاوي يدي دييرمان الخاصة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('821', 'ar', 'product', '29', 'description', 'طبق مشاوي مشكل خاص يتكون من 2 كفتة، 2 دجاج مشوي، سيخ شيش طاووق واحد و2 ريش غنم.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('822', 'ar', 'product', '30', 'name', 'أرز بالحليب');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('823', 'ar', 'product', '30', 'description', 'أرز بالحليب كريمي مخبوز بالفرن، يُقدم مع البندق على الوجه.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('824', 'ar', 'product', '31', 'name', 'ماء');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('825', 'ar', 'product', '31', 'description', 'ماء شرب منعش.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('826', 'ar', 'product', '32', 'name', 'شاي');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('827', 'ar', 'product', '32', 'description', 'شاي تركي تقليدي مخمر طازجًا.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('828', 'ar', 'product', '33', 'name', 'سماور صغير');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('829', 'ar', 'product', '33', 'description', 'شاي سماور بحجم صغير، مخمر طازجًا، مناسب للمشاركة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('830', 'ar', 'product', '34', 'name', 'سماور متوسط');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('831', 'ar', 'product', '34', 'description', 'شاي سماور بحجم متوسط، مثالي للعائلات ومجموعات الأصدقاء.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('832', 'ar', 'product', '35', 'name', 'سماور كبير');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('833', 'ar', 'product', '35', 'description', 'شاي سماور بحجم كبير، مناسب للموائد الكبيرة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('834', 'ar', 'product', '36', 'name', 'كولا 1 لتر');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('835', 'ar', 'product', '36', 'description', 'كولا 1 لتر تُقدم باردة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('836', 'ar', 'product', '37', 'name', 'مشروب غازي بالبرتقال 1 لتر');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('837', 'ar', 'product', '37', 'description', 'مشروب غازي بالبرتقال 1 لتر يُقدم باردًا.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('838', 'ar', 'product', '38', 'name', 'كولا علبة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('839', 'ar', 'product', '38', 'description', 'كولا علبة تُقدم باردة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('840', 'ar', 'product', '39', 'name', 'عصير فواكه علبة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('841', 'ar', 'product', '39', 'description', 'عصير فواكه معلب، متوفر بنكهات متنوعة ويُقدم باردًا.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('842', 'ar', 'product', '40', 'name', 'شاي مثلج علبة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('843', 'ar', 'product', '40', 'description', 'شاي مثلج معلب منعش يُقدم باردًا.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('844', 'ar', 'product', '41', 'name', 'مياه غازية سادة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('845', 'ar', 'product', '41', 'description', 'مياه غازية سادة تُقدم باردة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('846', 'ar', 'product', '42', 'name', 'صودا فواكه');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('847', 'ar', 'product', '42', 'description', 'مياه معدنية بنكهة الفاكهة، تقدم باردة.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('848', 'ar', 'allergen', '1', 'name', 'غلوتين');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('849', 'ar', 'allergen', '2', 'name', 'حليب ومنتجات الألبان');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('850', 'ar', 'allergen', '3', 'name', 'بيض');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('851', 'ar', 'allergen', '4', 'name', 'مكسرات');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('852', 'ar', 'allergen', '5', 'name', 'لحم بقري');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('853', 'ar', 'allergen', '6', 'name', 'خالي من الغلوتين *قد يحتوي على آثار من الغلوتين بسبب بيئة المطبخ.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('854', 'ar', 'allergen', '7', 'name', 'ذرة');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('855', 'ar', 'allergen', '8', 'name', 'لحم غنم');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('856', 'ar', 'allergen', '9', 'name', 'دجاج');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('857', 'ar', 'setting', '1', 'site_title', 'منتزه الطواحين السبعة الطبيعي');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('858', 'ar', 'setting', '2', 'site_subtitle', 'مقهى ومطعم');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('859', 'ru', 'category', '10', 'name', 'Завтраки');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('860', 'ru', 'category', '11', 'name', 'Супы');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('861', 'ru', 'category', '12', 'name', 'Блюда из котлет');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('862', 'ru', 'category', '13', 'name', 'Мясные блюда');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('863', 'ru', 'category', '14', 'name', 'Отбивные');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('864', 'ru', 'category', '15', 'name', 'Блюда из курицы');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('865', 'ru', 'category', '16', 'name', 'Фирменные блюда на гриле');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('866', 'ru', 'category', '17', 'name', 'Десерты');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('867', 'ru', 'category', '18', 'name', 'Напитки');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('868', 'ru', 'category', '19', 'name', 'Чай из самовара');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('869', 'ru', 'product', '12', 'name', 'Разнообразный завтрак ''Серпме''');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('870', 'ru', 'product', '12', 'description', 'Обильный завтрак с 4 видами сыра, тарелкой свежих овощей, различными оливками, медом, сливочным маслом, 3 видами варенья, яичницей на сливочном масле, картофелем фри, сосисками, бёреком (слоёным пирогом) и неограниченным чаем из самовара.
Стоимость: 600 TL на человека, минимальный заказ для 2-х персон.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('871', 'ru', 'product', '12', 'serving_size', 'На 2 персоны');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('872', 'ru', 'product', '13', 'name', 'Мухлама (Куймак)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('873', 'ru', 'product', '13', 'description', 'Горячее, тягучее региональное блюдо, приготовленное из сливочного масла, особого сыра и кукурузной муки.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('874', 'ru', 'product', '14', 'name', 'Яичница с суджуком');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('875', 'ru', 'product', '14', 'description', 'Классический завтрак: яйца, приготовленные на сковороде, с кусочками вкусного суджука.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('876', 'ru', 'product', '15', 'name', 'Менемен');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('877', 'ru', 'product', '15', 'description', 'Традиционный менемен, приготовленный из помидоров, перца и яиц, подается горячим.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('878', 'ru', 'product', '16', 'name', 'Яичница с кавурмой');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('879', 'ru', 'product', '16', 'description', 'Сытное блюдо для завтрака, сочетающее тщательно приготовленную кавурму и яйца.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('880', 'ru', 'product', '17', 'name', 'Чечевичный суп');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('881', 'ru', 'product', '17', 'description', 'Классический чечевичный суп, густой и подается горячим, подходит для любого времени дня.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('882', 'ru', 'product', '18', 'name', 'Региональный капустный суп');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('883', 'ru', 'product', '18', 'description', 'Любимое блюдо черноморской кухни; горячий суп, приготовленный из капусты, местных ингредиентов и особых специй.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('884', 'ru', 'product', '19', 'name', 'Порция Кёфте');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('885', 'ru', 'product', '19', 'description', 'Котлеты из баранины и ягнятины; подаются с рисом, картофелем фри и овощами на гриле.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('886', 'ru', 'product', '20', 'name', 'Кёфте (1 кг)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('887', 'ru', 'product', '20', 'description', 'Подача кёфте для компании; подается с салатом. Рис можно заказать дополнительно.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('888', 'ru', 'product', '20', 'serving_size', '1000 г');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('889', 'ru', 'product', '21', 'name', 'Соте из мяса в глиняном горшочке');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('890', 'ru', 'product', '21', 'description', 'Нежное мясо, овощи и специальный соус, приготовленные в глиняном горшочке; подается горячим.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('891', 'ru', 'product', '22', 'name', 'Сач Кавурма');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('892', 'ru', 'product', '22', 'description', 'Основное блюдо с богатым вкусом, приготовленное из нарезанного кубиками мяса с овощами и специями на садже.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('893', 'ru', 'product', '23', 'name', 'Порция бараньих ребрышек');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('894', 'ru', 'product', '23', 'description', 'Тщательно приготовленные бараньи ребрышки; подаются с рисом, картофелем фри и овощами на гриле.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('895', 'ru', 'product', '23', 'serving_size', '250 г');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('896', 'ru', 'product', '24', 'name', 'Бараньи ребрышки (0,5 кг)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('897', 'ru', 'product', '24', 'description', 'Подача бараньих ребрышек для компании; подается с салатом. Рис заказывается дополнительно.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('898', 'ru', 'product', '25', 'name', 'Бараньи ребрышки (1 кг)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('899', 'ru', 'product', '25', 'description', 'Большая порция бараньих ребрышек, идеально подходящая для большой компании; подается с салатом. Рис заказывается дополнительно.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('900', 'ru', 'product', '25', 'serving_size', '1000 г');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('901', 'ru', 'product', '26', 'name', 'Порция курицы на гриле');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('902', 'ru', 'product', '26', 'description', 'Тщательно приготовленная курица на гриле; подается с рисом, картофелем фри и овощами на гриле.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('903', 'ru', 'product', '27', 'name', 'Курица на гриле (1 кг)');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('904', 'ru', 'product', '27', 'description', 'Курица на гриле для компании; идеально подходит для больших столов, подается горячей и свежей.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('905', 'ru', 'product', '27', 'serving_size', '1000 г');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('906', 'ru', 'product', '28', 'name', 'Куриное соте');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('907', 'ru', 'product', '28', 'description', 'Куриное мясо, обжаренное с овощами; подается с рисом, картофелем фри и овощами на гриле.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('908', 'ru', 'product', '29', 'name', 'Фирменный гриль «Едидеирмен»');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('909', 'ru', 'product', '29', 'description', 'Особое ассорти-гриль: 2 фрикадельки (кёфте), 2 кусочка курицы на гриле, 1 куриный шашлык (шиш-кебаб) и 2 бараньи отбивные.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('910', 'ru', 'product', '30', 'name', 'Молочный рисовый пудинг «Сютлач»');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('911', 'ru', 'product', '30', 'description', 'Запеченный сливочный рисовый пудинг, подается с фундуком.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('912', 'ru', 'product', '31', 'name', 'Вода');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('913', 'ru', 'product', '31', 'description', 'Освежающая питьевая вода.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('914', 'ru', 'product', '32', 'name', 'Чай');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('915', 'ru', 'product', '32', 'description', 'Свежезаваренный традиционный турецкий чай.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('916', 'ru', 'product', '33', 'name', 'Маленький самовар');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('917', 'ru', 'product', '33', 'description', 'Свежезаваренный чай в маленьком самоваре, идеально для совместного чаепития.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('918', 'ru', 'product', '34', 'name', 'Средний самовар');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('919', 'ru', 'product', '34', 'description', 'Свежезаваренный чай в самоваре среднего размера, идеально для семьи и друзей.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('920', 'ru', 'product', '35', 'name', 'Большой самовар');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('921', 'ru', 'product', '35', 'description', 'Свежезаваренный чай в большом самоваре, идеально для больших компаний.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('922', 'ru', 'product', '36', 'name', 'Кока-Кола 1 литр');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('923', 'ru', 'product', '36', 'description', 'Охлажденная Кока-Кола, 1 литр.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('924', 'ru', 'product', '37', 'name', 'Апельсиновый газированный напиток 1 литр');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('925', 'ru', 'product', '37', 'description', 'Охлажденный 1 литр апельсинового газированного напитка.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('926', 'ru', 'product', '38', 'name', 'Кока-Кола в банке');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('927', 'ru', 'product', '38', 'description', 'Охлажденная Кока-Кола в банке.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('928', 'ru', 'product', '39', 'name', 'Фруктовый сок в банке');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('929', 'ru', 'product', '39', 'description', 'Охлажденный фруктовый сок в банке, вкус на выбор.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('930', 'ru', 'product', '40', 'name', 'Холодный чай в банке');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('931', 'ru', 'product', '40', 'description', 'Освежающий холодный чай в банке, подается охлажденным.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('932', 'ru', 'product', '41', 'name', 'Минеральная вода без газа');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('933', 'ru', 'product', '41', 'description', 'Минеральная вода без газа, подается охлажденной.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('934', 'ru', 'product', '42', 'name', 'Фруктовая содовая');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('935', 'ru', 'product', '42', 'description', 'Минеральная вода с фруктовым вкусом, подается охлажденной.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('936', 'ru', 'allergen', '1', 'name', 'Глютен');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('937', 'ru', 'allergen', '2', 'name', 'Молоко и молочные продукты');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('938', 'ru', 'allergen', '3', 'name', 'Яйца');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('939', 'ru', 'allergen', '4', 'name', 'Орехи');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('940', 'ru', 'allergen', '5', 'name', 'Телятина');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('941', 'ru', 'allergen', '6', 'name', 'Без глютена *Может содержать следы глютена из-за особенностей приготовления на кухне.');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('942', 'ru', 'allergen', '7', 'name', 'Кукуруза');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('943', 'ru', 'allergen', '8', 'name', 'Баранина');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('944', 'ru', 'allergen', '9', 'name', 'Курица');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('945', 'ru', 'setting', '1', 'site_title', 'Природный парк «Семь Мельниц»');
INSERT INTO `translations` (`id`, `language_code`, `entity_type`, `entity_id`, `field_name`, `translation_text`) VALUES ('946', 'ru', 'setting', '2', 'site_subtitle', 'Кафе и Ресторан');

COMMIT;
