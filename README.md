# Coolora

Site e-commerce statique premium pour Coolora, conçu en HTML, CSS et JavaScript vanilla.

## Ouvrir le site

Ouvrez `index.html` directement dans votre navigateur.

Pour un aperçu avec serveur local, vous pouvez aussi lancer :

```bash
python -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

## Remplacer les images

Les images sont dans `assets/images`.

Gardez les mêmes noms de fichiers si vous voulez remplacer une image sans modifier le code :

- `hero-mediterranean.webp` : fond hero avec mer et voile.
- `mediterranean-arch.webp` : ambiance méditerranéenne.
- `product-air-luxe-cutout.webp` : Coolora Air Luxe.
- `product-pro-360-cutout.webp` : Coolora Pro 360.
- `lifestyle-beach.webp`, `lifestyle-city.webp`, `lifestyle-home.webp` : cartes usages et avis.
- `coolora-logo-symbol-cutout.webp` : symbole du logo.

## Modifier les textes et prix

Tout le contenu visible est dans `index.html`.

Les prix se trouvent dans la section `Nos produits` :

- Coolora Air Luxe : `80 €`
- Coolora Pro 360 : `149 €`

## Déployer

### Netlify

1. Créez un nouveau site depuis le dossier du projet.
2. Aucun build command n’est nécessaire.
3. Le dossier de publication est la racine du projet.

### Vercel

1. Importez le projet.
2. Choisissez un projet statique.
3. Laissez la commande de build vide.
4. Le dossier de sortie est la racine du projet.

## Connecter une commande plus tard

Les boutons `Commander maintenant` et `Découvrir` pointent aujourd’hui vers des sections internes.

Pour connecter Stripe, PayPal, Tally ou Formspree plus tard, remplacez les liens `href` des boutons dans `index.html` par votre lien sécurisé.

Pour un lien externe, gardez `target="_blank"` et `rel="noopener noreferrer"`.
