# Conduite Privée — site vitrine

Site vitrine de **CONDUITE PRIVÉE** (SARL, Lormont · Bordeaux), transport privé de voyageurs : transferts aéroport et gare, navettes d'entreprise, trajets privés sur réservation.

## Contenu actuel : maquette v7 (direction VIP) de la page d'accueil

```
index.html            page d'accueil (HTML sémantique, SEO, JSON-LD LocalBusiness)
assets/css/style.css  identité visuelle (style « Nuit turquoise » retenu) (thème sombre, accent turquoise du logo officiel)
assets/js/main.js     menu, en-tête au défilement, demande rapide, animations
assets/img/           logos officiels, photos (plaque floutée) et image de la vidéo
assets/video/         vidéo du hero, compressée pour le web (1280 px, sans son)
```

Site statique sans dépendance : ouvrir `index.html` dans un navigateur suffit.

### Sections
En-tête fixe avec CTA · hero avec demande rapide · repères de confiance · la maison (valeurs) · services · flotte (Classe V, Sprinter) · réservation en 4 étapes · zone desservie (schéma) · emplacement avis clients · FAQ · bandeau d'appel à l'action · pied de page avec mentions légales de l'entreprise · barre d'action mobile.

### Informations à compléter
Tous les éléments manquants sont marqués `<span class="ph">[…]</span>` (soulignés en pointillés) ou par des blocs « Photo à intégrer » :

- e-mail commercial, horaires
- année du Sprinter, capacité bagages (aucun équipement non confirmé n'est affiché)
- texte complet de l'avis de Garance D. (tronqué sur la capture)
- portrait de Sébastien Luccioni (section Votre interlocuteur)
- domaine www.conduiteprivee.com à vérifier avant configuration DNS
- délai de réservation conseillé (FAQ)
- numéro d'inscription au registre VTC (FAQ, pied de page)
- photo du Sprinter ; remplacer à terme les visuels fournis (vidéo à plaque britannique, photos d'illustration) par des photos des véhicules de l'entreprise
- avis clients vérifiés et logos partenaires (aucun avis inventé)
- URL définitive (`<link rel="canonical">`)

Aucun tarif, avis, certification ni coordonnée n'a été inventé. La variante « fond sombre » du logo passe seulement le mot CONDUITE du noir au blanc : à faire valider.

### Brancher un système de réservation
Dans `assets/js/main.js`, l'objet `BOOKING` centralise l'envoi :
- `reservationPage` : URL de la future page Réservation, pré-remplie par les paramètres de la demande rapide ;
- `submitRequest(payload)` : point unique pour appeler une API ou un outil de réservation.

### Prochaines étapes
Pages Services, Flotte, À propos, Réservation et devis, Contact (avec carte), Mentions légales, Politique de confidentialité RGPD, bandeau cookies, sitemap.xml et robots.txt.
