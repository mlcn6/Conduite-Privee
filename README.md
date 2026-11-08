# Conduite Privée — site vitrine

Site vitrine de **CONDUITE PRIVÉE** (SARL, Lormont · Bordeaux), transport privé de voyageurs : transferts aéroport et gare, navettes d'entreprise, trajets privés sur réservation.

## Contenu actuel : maquette v5 de la page d'accueil

```
index.html            page d'accueil (HTML sémantique, SEO, JSON-LD LocalBusiness)
assets/css/style.css  identité visuelle (style 1 par défaut)
assets/css/styles-maquettes.css  4 autres directions visuelles + sélecteur de style
                      (thème sombre, accent turquoise du logo officiel)
assets/js/main.js     menu, en-tête au défilement, demande rapide, animations
assets/img/           logos officiels (original, variante fond sombre, monogramme, favicon)
```

Site statique sans dépendance : ouvrir `index.html` dans un navigateur suffit.

### Sections
En-tête fixe avec CTA · hero avec demande rapide · repères de confiance · la maison (valeurs) · services · flotte (Classe V, Sprinter) · réservation en 4 étapes · zone desservie (schéma) · emplacement avis clients · FAQ · bandeau d'appel à l'action · pied de page avec mentions légales de l'entreprise · barre d'action mobile.

### Informations à compléter
Tous les éléments manquants sont marqués `<span class="ph">[…]</span>` (soulignés en pointillés) ou par des blocs « Photo à intégrer » :

- e-mail commercial, horaires
- année du Sprinter, capacité bagages (aucun équipement non confirmé n'est affiché)
- note Google 5/5 (6 avis) à revérifier avant publication
- domaine www.conduiteprivee.com à vérifier avant configuration DNS
- délai de réservation conseillé (FAQ)
- numéro d'inscription au registre VTC (FAQ, pied de page)
- photos : hero plein cadre, chauffeur, Classe V, Sprinter, image de partage (og:image)
- avis clients vérifiés et logos partenaires (aucun avis inventé)
- URL définitive (`<link rel="canonical">`)

Aucun tarif, avis, certification ni coordonnée n'a été inventé. La variante « fond sombre » du logo passe seulement le mot CONDUITE du noir au blanc : à faire valider.

### Brancher un système de réservation
Dans `assets/js/main.js`, l'objet `BOOKING` centralise l'envoi :
- `reservationPage` : URL de la future page Réservation, pré-remplie par les paramètres de la demande rapide ;
- `submitRequest(payload)` : point unique pour appeler une API ou un outil de réservation.

### Prochaines étapes
Pages Services, Flotte, À propos, Réservation et devis, Contact (avec carte), Mentions légales, Politique de confidentialité RGPD, bandeau cookies, sitemap.xml et robots.txt.

### Comparer les 5 styles
Un sélecteur en bas de page permet de basculer entre les 5 directions : 1 Nuit turquoise, 2 Éditorial blanc, 3 Bleu nuit, 4 Noir minimal, 5 Signature. On peut aussi ouvrir directement `index.html?style=editorial` (ou `corporate`, `minimal`, `signature`). Une fois le style choisi, ses règles seront fusionnées dans `style.css` et le sélecteur retiré.
