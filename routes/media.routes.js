const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * @swagger
 * tags:
 * name: Media
 * description: Accès aux fichiers statiques (Images)
 */

/**
 * @swagger
 * /media/photos/{filename}:
 * get:
 * summary: Télécharger l'image d'une photo
 * tags: [Media]
 * parameters:
 * - in: path
 * name: filename
 * required: true
 * schema:
 * type: string
 * description: Nom du fichier image
 * responses:
 * 200:
 * description: Fichier image (JPEG/PNG)
 * content:
 * image/*:
 * schema:
 * type: string
 * format: binary
 * 404:
 * description: Fichier introuvable
 */
router.get('/photos/:filename', (req, res) => {
  const filepath = path.join(__dirname, '../uploads/photos', req.params.filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

/**
 * @swagger
 * /media/avatars/{filename}:
 * get:
 * summary: Télécharger l'avatar d'un utilisateur
 * tags: [Media]
 * parameters:
 * - in: path
 * name: filename
 * required: true
 * schema:
 * type: string
 * description: Nom du fichier avatar
 * responses:
 * 200:
 * description: Fichier image (JPEG/PNG)
 * content:
 * image/*:
 * schema:
 * type: string
 * format: binary
 * 404:
 * description: Fichier introuvable
 */
router.get('/avatars/:filename', (req, res) => {
  const filepath = path.join(__dirname, '../uploads/avatars', req.params.filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;

