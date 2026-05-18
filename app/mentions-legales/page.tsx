import LegalLayout from "@/components/sections/LegalLayout";

const TOC = [
  { id: "preambule", label: "Préambule" },
  { id: "identification", label: "Identification de l'éditeur" },
  { id: "direction", label: "Direction de la publication" },
  { id: "hebergement", label: "Hébergement du site" },
  { id: "infrastructure", label: "Infrastructure technique" },
  { id: "conception", label: "Conception et développement" },
  { id: "activite", label: "Activité et statut juridique" },
  { id: "propriete", label: "Propriété intellectuelle" },
  { id: "marques", label: "Marques et signes distinctifs" },
  { id: "credits", label: "Crédits photographiques" },
  { id: "liens", label: "Liens hypertextes" },
  { id: "cookies", label: "Cookies et traceurs" },
  { id: "donnees", label: "Données personnelles" },
  { id: "responsabilite", label: "Responsabilité de l'éditeur" },
  { id: "disponibilite", label: "Disponibilité du service" },
  { id: "securite", label: "Sécurité informatique" },
  { id: "accessibilite", label: "Accessibilité numérique" },
  { id: "signalement", label: "Signalement de contenus illicites" },
  { id: "mediation", label: "Médiation de la consommation" },
  { id: "droit", label: "Droit applicable et juridiction" },
  { id: "modifications", label: "Modifications" },
  { id: "contact", label: "Contact" },
];

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      eyebrow="Informations légales · Partnexx"
      title="Mentions légales"
      lastUpdate="10 mai 2026"
      version="2.0"
      toc={TOC}
    >
      <h2 id="preambule">1. Préambule</h2>
      <p>Les présentes mentions légales sont communiquées à toute personne accédant au site partnexx.com et à ses sous-domaines (ci-après le « Site »), en application des articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (« LCEN »).</p>
      <p>Tout utilisateur du Site est tenu de prendre connaissance des présentes mentions légales. La poursuite de la navigation sur le Site vaut acceptation sans réserve des dispositions ci-après.</p>

      <h2 id="identification">2. Identification de l&apos;éditeur</h2>
      <h3>2.1 Dénomination sociale</h3>
      <p>Le Site est édité par <strong>Partnexx SAS</strong>, société par actions simplifiée de droit français.</p>
      <h3>2.2 Coordonnées</h3>
      <ul>
        <li><strong>Forme juridique :</strong> Société par actions simplifiée (SAS)</li>
        <li><strong>Capital social :</strong> 500 €</li>
        <li><strong>Siège social :</strong> Paris, France</li>
        <li><strong>RCS :</strong> 999 731 417 R.C.S. Paris</li>
        <li><strong>SIRET :</strong> 99973141700013</li>
        <li><strong>Code APE / NAF :</strong> 6312Z (Portails Internet)</li>
        <li><strong>TVA intracommunautaire :</strong> FR47999731417</li>
        <li><strong>Email :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Téléphone :</strong> disponible sur demande via le support</li>
      </ul>

      <h2 id="direction">3. Direction de la publication</h2>
      <p>Le directeur de la publication, au sens de l&apos;article 93-2 de la loi n° 82-652 du 29 juillet 1982 sur la communication audiovisuelle, est le représentant légal de Partnexx SAS.</p>
      <p>Pour toute question relative au contenu publié sur le Site, vous pouvez contacter la direction de la publication à l&apos;adresse : <a href="mailto:legal@partnexx.com">legal@partnexx.com</a>.</p>

      <h2 id="hebergement">4. Hébergement du site</h2>
      <h3>4.1 Hébergeur principal</h3>
      <p>Le Site est hébergé par <strong>Vercel Inc.</strong></p>
      <ul>
        <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
        <li><strong>Site web :</strong> vercel.com</li>
        <li><strong>Contact :</strong> conformément à la politique de Vercel</li>
      </ul>
      <h3>4.2 Backend et base de données</h3>
      <p>L&apos;infrastructure backend (base de données, authentification, stockage, fonctions serverless) est fournie par <strong>Supabase</strong>, opérée principalement dans des datacenters européens conformes au RGPD.</p>
      <h3>4.3 CDN et services tiers</h3>
      <p>La distribution des contenus statiques est assurée via le réseau CDN global de Vercel, garantissant des temps de réponse optimisés en France et en Europe.</p>

      <h2 id="infrastructure">5. Infrastructure technique</h2>
      <p>Le Site est développé avec les technologies suivantes : React, TypeScript, Vite, Tailwind CSS. Les communications entre le navigateur et nos serveurs sont systématiquement chiffrées via le protocole HTTPS / TLS 1.3.</p>
      <p>Le Site fait l&apos;objet d&apos;un monitoring continu (disponibilité, performance, sécurité) afin d&apos;assurer la meilleure expérience possible aux utilisateurs.</p>

      <h2 id="conception">6. Conception et développement</h2>
      <p>La conception graphique, le développement et la maintenance du Site sont réalisés en interne par les équipes de Partnexx SAS, avec l&apos;aide ponctuelle de prestataires spécialisés sélectionnés sur des critères de qualité, de conformité et de protection des données.</p>

      <h2 id="activite">7. Activité et statut juridique</h2>
      <p>Partnexx exploite une plateforme de mise en relation entre créateurs de contenu numérique et marques / annonceurs, dans le cadre de campagnes UGC, d&apos;affiliation, d&apos;ambassadeurs et de communications digitales.</p>
      <p>Conformément aux articles L.111-7 et suivants du Code de la consommation, Partnexx agit en qualité d&apos;<strong>opérateur de plateforme en ligne</strong>. Une information loyale, claire et transparente sur les modalités de référencement, de classement et de déréférencement est mise à disposition des utilisateurs au sein de la Plateforme.</p>
      <p>Partnexx n&apos;exerce ni activité bancaire ni activité d&apos;assurance. Les services de paiement sont exécutés par notre prestataire <strong>Stripe Payments Europe Ltd</strong>, établissement de monnaie électronique agréé.</p>

      <h2 id="propriete">8. Propriété intellectuelle</h2>
      <h3>8.1 Titularité</h3>
      <p>L&apos;ensemble des éléments composant le Site (textes, photographies, images, vidéos, illustrations, logos, icônes, sons, musiques, mises en page, animations, code source, base de données, structure, charte graphique, interfaces) est la propriété exclusive de Partnexx SAS ou de ses concédants.</p>
      <h3>8.2 Étendue des droits</h3>
      <p>Conformément aux dispositions des articles L.111-1 et suivants du Code de la propriété intellectuelle, Partnexx SAS bénéficie sur ces éléments d&apos;une protection au titre du droit d&apos;auteur, du droit des marques, du droit des bases de données et des règles applicables au droit voisin.</p>
      <h3>8.3 Reproduction et exploitation</h3>
      <p>Toute reproduction, représentation, modification, adaptation, traduction, exploitation commerciale ou non, totale ou partielle, par quelque procédé que ce soit et sur quelque support que ce soit, sans l&apos;autorisation écrite préalable et expresse de Partnexx SAS, est strictement interdite.</p>
      <p>Tout manquement constitue une <strong>contrefaçon</strong> sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle, passible de 3 ans d&apos;emprisonnement et de 300 000 € d&apos;amende.</p>
      <h3>8.4 Utilisations autorisées</h3>
      <p>Sont autorisées, sans accord préalable, les utilisations strictement conformes au droit français : courtes citations avec mention de la source, copie privée à des fins exclusivement personnelles non destinées à une utilisation collective, et impressions à des fins de consultation personnelle.</p>

      <h2 id="marques">9. Marques et signes distinctifs</h2>
      <p>La marque « <strong>Partnexx</strong> », le logo Partnexx, ainsi que les autres marques, dessins, modèles et signes distinctifs reproduits sur le Site sont des marques déposées propriété de Partnexx SAS ou de ses partenaires.</p>
      <p>Toute reproduction, imitation ou usage non autorisé, totale ou partielle, de ces marques, dessins, modèles et signes distinctifs, sans autorisation écrite préalable de Partnexx SAS, expose son auteur à des poursuites en contrefaçon de marque (articles L.713-1 et suivants du Code de la propriété intellectuelle) et en concurrence déloyale et parasitaire.</p>

      <h2 id="credits">10. Crédits photographiques et iconographiques</h2>
      <p>Les ressources visuelles utilisées sur le Site proviennent :</p>
      <ul>
        <li>de productions originales réalisées par les équipes Partnexx ;</li>
        <li>de photographies sous licence <strong>Unsplash</strong>, <strong>Pexels</strong> ou similaires (libres de droits avec attribution non requise) ;</li>
        <li>d&apos;illustrations sous licence commerciale dûment acquise ;</li>
        <li>d&apos;icônes de la bibliothèque <strong>Lucide</strong> (licence ISC).</li>
      </ul>
      <p>Toute personne identifiable sur une photographie a donné son accord exprès à la diffusion de son image sur le Site.</p>
      <h2 id="liens">11. Liens hypertextes</h2>
      <h3>11.1 Liens sortants</h3>
      <p>Le Site peut contenir des liens hypertextes pointant vers des sites tiers. Partnexx n&apos;exerce aucun contrôle sur ces sites et ne saurait être tenu responsable de leur contenu, de leur disponibilité, de leur politique de confidentialité ou des dommages résultant de leur consultation.</p>
      <h3>11.2 Liens entrants</h3>
      <p>La création de liens hypertextes vers le Site est libre, sous réserve de :</p>
      <ul>
        <li>ne pas porter atteinte à l&apos;image ou aux intérêts de Partnexx ;</li>
        <li>ne pas créer de confusion sur l&apos;identité de l&apos;éditeur ;</li>
        <li>indiquer clairement la source ;</li>
        <li>ne pas inclure le Site dans un cadre (technique « framing »).</li>
      </ul>
      <p>Partnexx se réserve le droit de demander la suppression de tout lien qui ne respecterait pas ces conditions.</p>

      <h2 id="cookies">12. Cookies et traceurs</h2>
      <p>Le Site utilise des cookies et traceurs nécessaires à son bon fonctionnement, ainsi que, sous réserve de votre consentement, des cookies de mesure d&apos;audience et de personnalisation. Pour plus d&apos;informations sur les types de cookies utilisés, leurs durées de conservation et la gestion de vos préférences, consultez notre <a href="/politique-confidentialite">Politique de confidentialité</a>.</p>

      <h2 id="donnees">13. Données personnelles</h2>
      <p>Le traitement des données personnelles collectées via le Site est régi par notre <a href="/politique-confidentialite">Politique de confidentialité</a>, conforme au Règlement (UE) 2016/679 du 27 avril 2016 (« RGPD ») et à la loi n° 78-17 du 6 janvier 1978 modifiée dite « Informatique et Libertés ».</p>
      <p>Le Délégué à la Protection des Données (DPO) peut être contacté à l&apos;adresse suivante : <a href="mailto:legal@partnexx.com">legal@partnexx.com</a>.</p>

      <h2 id="responsabilite">14. Responsabilité de l&apos;éditeur</h2>
      <h3>14.1 Exactitude des informations</h3>
      <p>Partnexx s&apos;efforce d&apos;assurer au mieux de ses possibilités l&apos;exactitude et la mise à jour des informations diffusées sur le Site, mais ne peut garantir l&apos;exhaustivité ou l&apos;absence de modification par un tiers. En conséquence, Partnexx décline toute responsabilité pour les éventuelles imprécisions, inexactitudes ou omissions portant sur les informations disponibles.</p>
      <h3>14.2 Utilisation du Site</h3>
      <p>L&apos;utilisateur reconnaît utiliser les informations et outils mis à disposition sous sa propre responsabilité. Partnexx ne saurait être tenu responsable des dommages directs ou indirects (perte de données, perte d&apos;opportunité, atteinte à la réputation) résultant de l&apos;utilisation du Site.</p>
      <h3>14.3 Statut d&apos;hébergeur des contenus utilisateurs</h3>
      <p>Pour les contenus publiés par les utilisateurs (profils créateurs, briefs, avis, etc.), Partnexx agit en qualité d&apos;<strong>hébergeur</strong> au sens de l&apos;article 6-I-2 de la LCEN. À ce titre, Partnexx ne peut voir sa responsabilité engagée que dans les conditions strictes prévues par la loi (connaissance effective du caractère illicite et inaction).</p>

      <h2 id="disponibilite">15. Disponibilité du service</h2>
      <p>Partnexx vise une disponibilité du Site de <strong>99,5 %</strong> en moyenne mensuelle, hors opérations de maintenance planifiées et hors cas de force majeure (article 1218 du Code civil).</p>
      <p>Partnexx se réserve le droit d&apos;interrompre temporairement l&apos;accès au Site pour des raisons de maintenance, de mise à jour ou de sécurité, sans que cette interruption puisse engager sa responsabilité. Les opérations planifiées sont notifiées avec un préavis de 48 heures lorsque cela est possible.</p>

      <h2 id="securite">16. Sécurité informatique</h2>
      <p>Partnexx met en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité du Site et des données échangées :</p>
      <ul>
        <li>chiffrement HTTPS / TLS 1.3 sur l&apos;ensemble du Site ;</li>
        <li>protection contre les attaques DDoS et bots malveillants ;</li>
        <li>analyses de vulnérabilités automatisées ;</li>
        <li>tests d&apos;intrusion réguliers ;</li>
        <li>sauvegardes chiffrées et géo-redondées.</li>
      </ul>
      <p>L&apos;utilisateur reconnaît avoir connaissance des limites et risques inhérents à internet et s&apos;engage à mettre en place les mesures nécessaires pour protéger son propre équipement (antivirus, mots de passe forts, etc.).</p>

      <h2 id="accessibilite">17. Accessibilité numérique</h2>
      <p>Partnexx s&apos;engage à rendre son Site accessible au plus grand nombre, y compris aux personnes en situation de handicap, conformément à l&apos;article 47 de la loi n° 2005-102 du 11 février 2005. Le Site tend à respecter les critères du Référentiel Général d&apos;Amélioration de l&apos;Accessibilité (RGAA 4.1) et les recommandations WCAG 2.1 niveau AA.</p>
      <p>Une déclaration d&apos;accessibilité détaillée est en cours d&apos;élaboration. Pour tout signalement d&apos;un problème d&apos;accessibilité, contactez <a href="mailto:legal@partnexx.com">legal@partnexx.com</a>.</p>

      <h2 id="signalement">18. Signalement de contenus illicites</h2>
      <p>Conformément à l&apos;article 6-I-5 de la LCEN, vous pouvez signaler à Partnexx tout contenu manifestement illicite (apologie de crime, incitation à la haine, contenu pédopornographique, atteinte à l&apos;autorité de la justice, etc.) :</p>
      <ul>
        <li>par email : <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li>via le formulaire de signalement intégré à la Plateforme.</li>
      </ul>
      <p>Toute notification doit comporter : votre identité, l&apos;identification précise du contenu litigieux, les motifs de droit et de fait justifiant le retrait, et la copie de la correspondance adressée à l&apos;auteur du contenu (le cas échéant). Tout signalement abusif est sanctionné par l&apos;article 6-I-4 de la LCEN (un an d&apos;emprisonnement et 15 000 € d&apos;amende).</p>

      <h2 id="mediation">19. Médiation de la consommation</h2>
      <p>Conformément aux articles L.611-1 et suivants du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige avec un professionnel.</p>
      <p>Le médiateur compétent peut être saisi via la plateforme européenne de règlement en ligne des litiges (RLL) : ec.europa.eu/consumers/odr.</p>

      <h2 id="droit">20. Droit applicable et juridiction</h2>
      <p>Les présentes mentions légales sont régies par le <strong>droit français</strong>. Tout litige relatif au Site, à son contenu ou à son utilisation, sera, à défaut de résolution amiable, soumis aux tribunaux compétents de Paris, y compris en cas de pluralité de défendeurs ou d&apos;appel en garantie.</p>
      <p>Cette clause attributive de compétence ne s&apos;applique pas aux utilisateurs consommateurs qui pourront saisir la juridiction française compétente selon les règles de droit commun.</p>

      <h2 id="modifications">21. Modifications</h2>
      <p>Partnexx se réserve la faculté de modifier les présentes mentions légales à tout moment, notamment pour tenir compte d&apos;évolutions légales ou techniques. La version applicable est celle en vigueur à la date de consultation du Site. Les utilisateurs sont invités à consulter régulièrement la présente page.</p>

      <h2 id="contact">22. Contact</h2>
      <ul>
        <li><strong>Questions générales :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Questions juridiques :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Données personnelles / DPO :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Signalement abus :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Accessibilité :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
      </ul>
    </LegalLayout>
  );
}