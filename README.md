# COOLORA

Boutique e-commerce statique premium de COOLORA, construite en HTML, CSS et JavaScript vanilla et déployable directement sur GitHub Pages.

## Lancer le site en local

```bash
python -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

## Pages principales

- `index.html` : accueil et présentation de la marque.
- `boutique.html` : catalogue des deux modèles COOLORA.
- `a-propos.html` : histoire, vision et engagements de la marque.
- `product-air-luxe.html` et `product-pro-360.html` : fiches produit.
- `panier.html` : panier persistant dans le navigateur avec `localStorage`.
- `checkout.html` : informations de commande et récapitulatif, sans paiement actif.
- `faq.html`, `contact.html` et les pages légales : informations client et réglementaires.
- `404.html`, `robots.txt` et `sitemap.xml` : gestion des erreurs et référencement.

## Images

Les images se trouvent dans `assets/images` :

- `hero-mediterranean.webp` : visuel principal.
- `mediterranean-arch.webp` : univers de marque.
- `product-air-luxe-cutout.webp` : COOLORA Air Luxe.
- `product-pro-360-cutout.webp` : COOLORA Pro 360.
- `lifestyle-beach.webp`, `lifestyle-city.webp`, `lifestyle-home.webp` : usages.
- `coolora-logo-symbol-cutout.webp` et `favicon.svg` : identité visuelle.

## Panier et commande

Le panier fonctionne sans backend grâce à `localStorage`. Il conserve le modèle, la couleur, la quantité et le total pendant la navigation.

Le paiement reste volontairement désactivé. Son intégration devra être réalisée avec un prestataire sécurisé avant l’ouverture des commandes payantes.

## Déploiement GitHub Pages

Aucune commande de build n’est nécessaire. Le site peut être publié directement depuis la racine du dépôt. Le domaine personnalisé est défini dans `CNAME`.
Pour un lien externe, gardez `target="_blank"` et `rel="noopener noreferrer"`.

## Structure de la boutique

Le site reste entièrement statique et compatible avec GitHub Pages : aucune commande de build n’est nécessaire.

- `product-air-luxe.html` et `product-pro-360.html` : fiches produit.
- `panier.html` : panier local enregistré dans le navigateur avec `localStorage`.
- `checkout.html` : aperçu du checkout, sans paiement actif.
- `faq.html` : questions fréquentes complètes.
- `contact.html` et les pages légales : structure prête à compléter avec les informations officielles.
- `404.html`, `robots.txt` et `sitemap.xml` : navigation d’erreur et référencement.

Le bouton de paiement reste volontairement non fonctionnel tant qu’un prestataire comme Stripe ou PayPal n’est pas configuré. Les données du panier restent uniquement dans le navigateur de la personne qui visite le site.
