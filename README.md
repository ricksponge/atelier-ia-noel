
# 🎅 Atelier de Noël AI

Une application web festive qui utilise l'IA (Gemini 2.5 Flash Image) pour ajouter automatiquement des bonnets de Noël et des effets festifs à vos photos.

## 🚀 Fonctionnalités

- 📸 **Upload d'image** : Importez n'hui quel portrait ou photo.
- 🪄 **Édition par IA** : Ajout intelligent de bonnets de Noël grâce au modèle Gemini 2.5 Flash Image.
- 🎨 **Presets festifs** : Choisissez parmi plusieurs styles (Bonnet classique, Filtre neige, etc.).
- 📥 **Téléchargement** : Récupérez votre image modifiée en haute qualité.

## 🛠️ Installation Locale

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-username/festive-hat-editor.git
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env.local` et ajoutez votre clé API Gemini :
   ```env
   API_KEY=votre_cle_api_ici
   ```
4. Lancez le projet :
   ```bash
   npm run dev
   ```

## 🌍 Déploiement

### Vercel

1. Connectez votre dépôt GitHub à Vercel.
2. Ajoutez la variable d'environnement `API_KEY` dans les paramètres de Vercel.
3. Déployez !

## 📝 Technologies utilisées

- **React** & **TypeScript**
- **Tailwind CSS** (Design)
- **Lucide React** (Icônes)
- **Google Gemini API** (Modèle `gemini-2.5-flash-image`)

---
Développé avec ❤️ pour les fêtes.
