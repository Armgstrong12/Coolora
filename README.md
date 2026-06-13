# COOLORA

Boutique e-commerce statique premium de COOLORA, construite en HTML, CSS et JavaScript vanilla et déployable directement sur GitHub Pages.

## Lancer le site en local

```bash
python -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

## Parcours de commande

Le site utilise des **Stripe Payment Links** externes, sans clé API ni donnée bancaire dans le dépôt :

1. accueil (`index.html`) ;
2. catalogue (`boutique.html`) ;
3. fiche produit ;
4. page de paiement Stripe ;
5. confirmation (`merci.html`).

Avant la mise en ligne, remplacer les deux valeurs suivantes dans les pages concernées par les Payment Links créés dans Stripe :

- `STRIPE_LINK_AIR_LUXE` ;
- `STRIPE_LINK_PRO_360`.

Configurer ensuite l’URL de redirection après paiement vers `https://coolora-paris.fr/merci.html` dans Stripe.

## Pages principales

- `index.html` : accueil et présentation de la marque.
- `boutique.html` : catalogue et comparaison des deux modèles.
- `product-air-luxe.html` et `product-pro-360.html` : fiches produit et accès direct au paiement.
- `a-propos.html`, `faq.html`, `contact.html` : marque et assistance.
- `livraison-retours.html` et les pages légales : informations client et réglementaires.
- `merci.html` : confirmation affichée après le paiement.
- `panier.html` et `checkout.html` : pages de transition conservées pour les anciennes URL, renvoyant vers la boutique.
- `404.html`, `robots.txt` et `sitemap.xml` : gestion des erreurs et référencement.

## Images

Les images se trouvent dans `assets/images`. Les fiches utilisent les visuels produit existants et des photos lifestyle distinctes. Les emplacements de détail sont prévus dans le HTML sans image commerciale inventée.

## Déploiement GitHub Pages

Aucune commande de build n’est nécessaire. Le site peut être publié directement depuis la racine du dépôt. Le domaine personnalisé est défini dans `CNAME`.
