import LegalLayout from "@/components/sections/LegalLayout";

const TOC = [
  { id: "preambule", label: "Préambule et objet" },
  { id: "definitions", label: "Définitions" },
  { id: "acceptation", label: "Acceptation et modification" },
  { id: "inscription", label: "Inscription et création de compte" },
  { id: "services", label: "Description des services" },
  { id: "services-createurs", label: "Services dédiés aux Créateurs" },
  { id: "services-marques", label: "Services dédiés aux Marques" },
  { id: "missions", label: "Fonctionnement des missions" },
  { id: "tarification", label: "Tarification, abonnements et paiements" },
  { id: "remuneration", label: "Rémunération des Créateurs" },
  { id: "score", label: "Partnexx Score et système de niveaux" },
  { id: "obligations", label: "Obligations des Utilisateurs" },
  { id: "propriete", label: "Contenus et propriété intellectuelle" },
  { id: "moderation", label: "Modération et signalement" },
  { id: "responsabilite", label: "Responsabilité et garanties" },
  { id: "force-majeure", label: "Force majeure" },
  { id: "resiliation", label: "Suspension et résiliation" },
  { id: "donnees", label: "Données personnelles et cookies" },
  { id: "confidentialite", label: "Confidentialité" },
  { id: "assurance", label: "Assurance et fiscalité" },
  { id: "cession", label: "Cession et sous-traitance" },
  { id: "droit", label: "Droit applicable et juridiction" },
  { id: "mediation", label: "Médiation et règlement des litiges" },
  { id: "diverses", label: "Dispositions diverses" },
  { id: "contact", label: "Contact" },
];

export default function CGUPage() {
  return (
    <LegalLayout
      eyebrow="Cadre contractuel · Plateforme Partnexx"
      title="Conditions Générales d'Utilisation"
      lastUpdate="10 mai 2026"
      version="2.0"
      toc={TOC}
    >
      <h2 id="preambule">1. Préambule et objet</h2>
      <p>Les présentes Conditions Générales d&apos;Utilisation (ci-après les « CGU ») constituent le contrat conclu entre <strong>Partnexx SAS</strong> (ci-après « Partnexx », « nous ») et toute personne physique ou morale (ci-après l&apos;« Utilisateur ») accédant et utilisant la plateforme accessible à l&apos;adresse partnexx.com et ses sous-domaines (ci-après la « Plateforme »).</p>
      <p>La Plateforme a pour vocation de mettre en relation des créateurs de contenu (« Créateurs ») avec des entreprises et marques (« Marques ») dans le cadre de missions de création de contenu numérique (UGC, affiliation, ambassadeurs, campagnes social media, etc.).</p>
      <p>Les présentes CGU définissent les conditions d&apos;accès, d&apos;utilisation et de fonctionnement de la Plateforme, ainsi que les droits et obligations respectifs de Partnexx et des Utilisateurs.</p>

      <h2 id="definitions">2. Définitions</h2>
      <p>Dans les présentes CGU, les termes suivants ont la signification ci-après :</p>
      <ul>
        <li><strong>Plateforme :</strong> ensemble des services en ligne accessibles depuis partnexx.com.</li>
        <li><strong>Utilisateur :</strong> toute personne accédant à la Plateforme, qu&apos;elle soit Créateur ou Marque.</li>
        <li><strong>Créateur :</strong> personne physique ayant créé un compte sur la Plateforme afin de proposer ses services de création de contenu.</li>
        <li><strong>Marque :</strong> personne morale ou entrepreneur individuel ayant créé un compte sur la Plateforme afin de publier des missions.</li>
        <li><strong>Compte :</strong> espace personnel sécurisé permettant à l&apos;Utilisateur d&apos;accéder aux fonctionnalités de la Plateforme.</li>
        <li><strong>Mission :</strong> prestation de création de contenu publiée par une Marque sur la Plateforme.</li>
        <li><strong>Brief :</strong> document descriptif fourni par la Marque détaillant les attentes, livrables, délais et conditions d&apos;une Mission.</li>
        <li><strong>Livrable :</strong> contenu produit par le Créateur dans le cadre d&apos;une Mission.</li>
        <li><strong>Rémunération :</strong> somme due par la Marque au Créateur en contrepartie des Livrables.</li>
        <li><strong>Commission :</strong> somme prélevée par Partnexx sur chaque Mission validée, exprimée en pourcentage du montant brut de la Rémunération.</li>
        <li><strong>Partnexx Score :</strong> note interne calculée par Partnexx selon des critères de qualité, régularité et satisfaction.</li>
        <li><strong>Abonnement :</strong> formule payante souscrite par les Marques pour accéder aux services de la Plateforme.</li>
        <li><strong>Contenu :</strong> tout texte, image, vidéo, audio, code ou donnée publié sur la Plateforme.</li>
      </ul>

      <h2 id="acceptation">3. Acceptation et modification des CGU</h2>
      <h3>3.1 Acceptation</h3>
      <p>L&apos;inscription sur la Plateforme et l&apos;utilisation de ses services impliquent l&apos;acceptation pleine, entière et sans réserve des présentes CGU. L&apos;Utilisateur reconnaît avoir pris connaissance des CGU avant toute utilisation et déclare les accepter en cochant la case prévue à cet effet lors de l&apos;inscription.</p>
      <h3>3.2 Modification</h3>
      <p>Partnexx se réserve le droit de modifier les CGU à tout moment, notamment pour tenir compte d&apos;évolutions légales, réglementaires ou fonctionnelles. Les Utilisateurs seront informés de toute modification substantielle par email et/ou via une notification sur la Plateforme, au moins <strong>15 jours</strong> avant l&apos;entrée en vigueur des nouvelles CGU. La poursuite de l&apos;utilisation de la Plateforme après cette date vaut acceptation des nouvelles CGU.</p>
      <h3>3.3 Opposabilité</h3>
      <p>Les CGU applicables sont celles en vigueur à la date d&apos;utilisation de la Plateforme. Une version archivée de chaque version des CGU est conservée par Partnexx et peut être communiquée sur simple demande.</p>

      <h2 id="inscription">4. Inscription et création de compte</h2>
      <h3>4.1 Conditions d&apos;inscription</h3>
      <p>L&apos;inscription est ouverte :</p>
      <ul>
        <li>aux personnes physiques majeures (18 ans révolus) ou mineures avec accord parental, pour les Créateurs ;</li>
        <li>aux personnes morales légalement constituées et représentées par une personne dûment habilitée, pour les Marques.</li>
      </ul>
      <h3>4.2 Informations requises</h3>
      <p>L&apos;Utilisateur s&apos;engage à fournir des informations exactes, sincères, complètes et à jour lors de son inscription, et à les actualiser sans délai en cas de changement. Toute inscription comportant des informations fausses ou trompeuses pourra entraîner la suspension ou la suppression du Compte.</p>
      <h3>4.3 Identifiants</h3>
      <p>L&apos;Utilisateur choisit ses identifiants (email + mot de passe) lors de son inscription. Il est responsable de la confidentialité de ses identifiants et de toute activité réalisée depuis son Compte. En cas de suspicion d&apos;usage non autorisé, l&apos;Utilisateur doit en informer immédiatement Partnexx.</p>
      <h3>4.4 Validation du Compte</h3>
      <p>Partnexx se réserve le droit de vérifier les informations fournies et de refuser ou suspendre toute inscription qui ne respecterait pas les conditions énoncées. La validation du Compte peut nécessiter la fourniture de pièces justificatives (KYC) conformément aux obligations légales.</p>

      <h2 id="services">5. Description des services</h2>
      <p>La Plateforme propose les services suivants :</p>
      <ul>
        <li>Création et gestion de profils Créateurs et Marques.</li>
        <li>Publication, recherche et matching de Missions via algorithme propriétaire.</li>
        <li>Outils de communication intégrés (messagerie, notifications).</li>
        <li>Gestion des Livrables, validation et workflow d&apos;approbation.</li>
        <li>Paiements sécurisés et facturation automatisée.</li>
        <li>Tableau de bord analytique (vues, CTR, ventes attribuées, ROI).</li>
        <li>Système de notation, avis et Partnexx Score.</li>
        <li>Support client et accompagnement humain.</li>
      </ul>
      <p>Partnexx peut faire évoluer, ajouter, modifier ou retirer tout ou partie de ces services à tout moment, dans le respect des engagements contractuels en cours.</p>

      <h2 id="services-createurs">6. Services dédiés aux Créateurs</h2>
      <h3>6.1 Accès</h3>
      <p>L&apos;inscription en tant que Créateur est <strong>gratuite et sans engagement</strong>. Le Créateur accède au feed des Missions ouvertes et peut postuler en un clic aux Missions correspondant à son profil.</p>
      <h3>6.2 Profil Créateur</h3>
      <p>Le Créateur renseigne son profil (bio, niche, audiences, exemples de contenus, tarifs indicatifs). Plus le profil est complet, plus le matching avec les Missions est performant.</p>
      <h3>6.3 Statut indépendant</h3>
      <p>Le Créateur agit en qualité de prestataire indépendant. Il est seul responsable de son statut juridique, de ses déclarations fiscales et sociales, et de l&apos;obtention de toutes autorisations nécessaires à l&apos;exercice de son activité.</p>

      <h2 id="services-marques">7. Services dédiés aux Marques</h2>
      <h3>7.1 Abonnement</h3>
      <p>L&apos;accès aux services Marques nécessite la souscription d&apos;un abonnement. Les formules disponibles, leur contenu et leur tarif sont décrits sur la <a href="/pricing">page Pricing</a>. Une formule gratuite est proposée pour permettre aux Marques de tester la Plateforme. Les abonnements payants sont mensuels, sans engagement de durée, résiliables à tout moment depuis l&apos;espace de gestion du Compte.</p>
      <h3>7.2 Publication de Missions</h3>
      <p>La Marque rédige et publie des Briefs détaillés. Partnexx propose un accompagnement éditorial optionnel pour optimiser les Briefs et maximiser la qualité du matching.</p>
      <h3>7.3 Sélection des Créateurs</h3>
      <p>La Marque peut sélectionner les Créateurs via : (i) le matching IA automatique, (ii) la recherche libre dans le pool de Créateurs, (iii) une short-list pré-sélectionnée par l&apos;équipe Partnexx.</p>

      <h2 id="missions">8. Fonctionnement des missions</h2>
      <h3>8.1 Cycle de vie d&apos;une Mission</h3>
      <ol>
        <li><strong>Publication :</strong> la Marque publie le Brief et son budget.</li>
        <li><strong>Candidatures :</strong> les Créateurs postulent en un clic.</li>
        <li><strong>Sélection :</strong> la Marque retient un ou plusieurs Créateurs.</li>
        <li><strong>Production :</strong> le Créateur produit les Livrables selon le Brief.</li>
        <li><strong>Validation :</strong> la Marque valide ou demande des modifications (max. 2 itérations).</li>
        <li><strong>Paiement :</strong> la Rémunération est versée au Créateur sous 7 jours.</li>
        <li><strong>Notation :</strong> Marque et Créateur s&apos;évaluent mutuellement.</li>
      </ol>
      <h3>8.2 Délais</h3>
      <p>Les délais de livraison sont définis dans le Brief. Tout retard imputable au Créateur peut entraîner une pénalité (réduction de la Rémunération, impact sur le Partnexx Score). Tout retard imputable à la Marque (validation tardive) ne peut être reproché au Créateur.</p>
      <h3>8.3 Annulation</h3>
      <p>L&apos;annulation d&apos;une Mission par la Marque après acceptation par un Créateur donne lieu au versement d&apos;une indemnité forfaitaire de <strong>30 % du budget initial</strong> au Créateur, sauf accord contraire des parties.</p>
      <h2 id="tarification">9. Tarification, abonnements et paiements</h2>
      <h3>9.1 Tarifs</h3>
      <p>Les tarifs des abonnements Marques sont disponibles sur la <a href="/pricing">page Pricing</a>. Tous les prix sont exprimés en euros et hors taxes. La TVA applicable est ajoutée selon le taux en vigueur.</p>
      <h3>9.2 Modalités de paiement</h3>
      <p>Les paiements sont opérés via notre prestataire <strong>Stripe</strong> (cartes bancaires, prélèvement SEPA, virement). Aucune information bancaire n&apos;est stockée par Partnexx. Les abonnements sont prélevés mensuellement à date anniversaire.</p>
      <h3>9.3 Défaut de paiement</h3>
      <p>En cas d&apos;incident de paiement, Partnexx pourra suspendre l&apos;accès aux services après un préavis de 7 jours. Tout retard de paiement entraîne de plein droit l&apos;application d&apos;une pénalité de retard égale à trois fois le taux d&apos;intérêt légal, majorée d&apos;une indemnité forfaitaire pour frais de recouvrement de 40 € (articles L.441-10 et D.441-5 du Code de commerce).</p>
      <h3>9.4 Facturation</h3>
      <p>Une facture est émise automatiquement à chaque échéance et mise à disposition dans l&apos;espace de gestion du Compte.</p>
      <h3>9.5 Droit de rétractation</h3>
      <p>Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux contrats conclus entre professionnels. Pour les Créateurs consommateurs, le droit de rétractation de 14 jours s&apos;applique sauf renonciation expresse pour bénéficier immédiatement du service.</p>

      <h2 id="remuneration">10. Rémunération des Créateurs et commission Partnexx</h2>
      <h3>10.1 Définition de la Rémunération</h3>
      <p>La Rémunération brute est définie librement entre la Marque et le Créateur dans le cadre du Brief.</p>
      <h3>10.2 Commission Partnexx</h3>
      <p>Partnexx prélève une <strong>commission de service comprise entre 7 % et 15 %</strong> sur le montant brut de chaque Mission validée. Le taux applicable dépend de la formule d&apos;abonnement souscrite par la Marque (Free : 15 %, Growth : 10 %, Scale : 7 %, Enterprise : taux négocié). Les détails et conditions sont publiés sur la <a href="/pricing">page Pricing</a> et peuvent évoluer dans les conditions prévues à l&apos;article 3.</p>
      <p>La commission est prélevée automatiquement au moment du paiement de la Rémunération au Créateur. Le Créateur perçoit donc la Rémunération brute diminuée de la commission Partnexx applicable.</p>
      <h3>10.3 Versement</h3>
      <p>Après validation des Livrables par la Marque, la Rémunération nette est versée au Créateur dans un délai maximum de <strong>7 jours ouvrés</strong>, par virement bancaire SEPA.</p>
      <h3>10.4 Statut fiscal et social</h3>
      <p>Le Créateur est seul responsable de la déclaration de ses revenus et du paiement des cotisations sociales et impôts associés. Partnexx peut, le cas échéant, fournir un récapitulatif annuel des Rémunérations perçues.</p>

      <h2 id="score">11. Partnexx Score et système de niveaux</h2>
      <p>Le Partnexx Score est un indicateur composite calculé par Partnexx selon les critères suivants : qualité des Livrables, respect des délais, taux de validation au premier rendu, satisfaction des Marques, régularité d&apos;activité, ancienneté.</p>
      <p>Il permet au Créateur de débloquer 8 niveaux progressifs :</p>
      <ul>
        <li><strong>Bronze</strong> → accès aux Missions standards</li>
        <li><strong>Argent</strong> → mise en avant dans le matching</li>
        <li><strong>Or</strong> → accès aux Missions premium</li>
        <li><strong>Platine</strong> → invitations privées</li>
        <li><strong>Diamant</strong> → coaching dédié</li>
        <li><strong>Élite</strong> → événements exclusifs</li>
        <li><strong>Champion</strong> → partenariats long terme</li>
        <li><strong>Légende</strong> → ambassadeur Partnexx</li>
      </ul>
      <p>Partnexx se réserve le droit d&apos;ajuster la formule de calcul, les seuils et les avantages associés à chaque niveau, sans que cela puisse être considéré comme une modification substantielle des présentes CGU.</p>

      <h2 id="obligations">12. Obligations des Utilisateurs</h2>
      <h3>12.1 Obligations générales</h3>
      <ul>
        <li>Respecter les lois et règlements en vigueur (notamment publicité, droit à l&apos;image, protection des mineurs, RGPD).</li>
        <li>Mentionner clairement le caractère commercial des contenus sponsorisés (#ad, #sponsorisé, #partenariat).</li>
        <li>Ne pas publier de contenu illicite, diffamatoire, haineux, sexuel, raciste, discriminatoire ou trompeur.</li>
        <li>Ne pas porter atteinte aux droits de tiers (propriété intellectuelle, vie privée, réputation).</li>
        <li>Ne pas utiliser la Plateforme à des fins frauduleuses ou pour blanchiment.</li>
        <li>Respecter les engagements pris dans le cadre des Missions.</li>
        <li>Ne pas contourner la Plateforme pour traiter directement avec une contrepartie rencontrée via Partnexx pendant <strong>12 mois</strong> (clause de non-désintermédiation).</li>
      </ul>
      <h3>12.2 Comportement</h3>
      <p>Tout comportement abusif, harcèlement, propos discriminatoires ou actes nuisibles à la communauté entraînera la suspension immédiate du Compte sans préavis.</p>

      <h2 id="propriete">13. Contenus et propriété intellectuelle</h2>
      <h3>13.1 Contenus de la Plateforme</h3>
      <p>La Plateforme, son design, ses fonctionnalités, son code source, sa base de données, ses marques et logos sont la propriété exclusive de Partnexx. Toute reproduction, copie, exploitation ou utilisation non autorisée est strictement interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
      <h3>13.2 Contenus des Utilisateurs</h3>
      <p>Les Utilisateurs conservent l&apos;intégralité des droits de propriété intellectuelle sur les contenus qu&apos;ils publient. En les publiant, ils accordent à Partnexx une licence non exclusive, mondiale et gratuite, pour la durée légale de protection, aux seules fins du fonctionnement, de la promotion et de l&apos;amélioration de la Plateforme.</p>
      <h3>13.3 Cession de droits sur les Livrables</h3>
      <p>Les droits accordés par le Créateur à la Marque sur les Livrables sont définis dans chaque Brief : type d&apos;usage (organique, paid, OOH), supports, territoires, durée, exclusivité éventuelle. À défaut de précision, la cession est limitée à un usage organique sur les réseaux sociaux pendant <strong>12 mois</strong> sur le territoire mondial.</p>
      <h3>13.4 Garantie d&apos;éviction</h3>
      <p>Le Créateur garantit qu&apos;il est titulaire de l&apos;ensemble des droits sur les Livrables, qu&apos;il a obtenu toutes autorisations nécessaires (musique, droits à l&apos;image des personnes filmées, etc.) et qu&apos;il garantit la Marque contre toute action en contrefaçon ou en parasitisme.</p>

      <h2 id="moderation">14. Modération et signalement</h2>
      <p>Partnexx met en œuvre des moyens raisonnables pour modérer les contenus publiés. Tout Utilisateur peut signaler un contenu ou comportement inapproprié via la fonction de signalement intégrée ou par email à <a href="mailto:legal@partnexx.com">legal@partnexx.com</a>.</p>
      <p>Conformément à la loi pour la confiance dans l&apos;économie numérique (LCEN) et au règlement européen DSA, Partnexx s&apos;engage à retirer promptement tout contenu manifestement illicite qui lui serait signalé.</p>

      <h2 id="responsabilite">15. Responsabilité et garanties</h2>
      <h3>15.1 Statut d&apos;intermédiaire</h3>
      <p>Partnexx agit en qualité d&apos;intermédiaire technique entre Créateurs et Marques. Partnexx n&apos;est partie ni au contrat de prestation entre les Utilisateurs, ni aux Livrables produits.</p>
      <h3>15.2 Obligation de moyens</h3>
      <p>Partnexx s&apos;engage à une obligation de moyens dans la fourniture de la Plateforme. La Plateforme est fournie « en l&apos;état » sans garantie d&apos;absence d&apos;erreurs, d&apos;interruptions, ou d&apos;adéquation à un usage particulier.</p>
      <h3>15.3 Limitation de responsabilité</h3>
      <p>Sauf en cas de faute lourde ou intentionnelle, la responsabilité de Partnexx, tous chefs de préjudice confondus, ne pourra excéder les sommes effectivement versées par l&apos;Utilisateur à Partnexx au cours des <strong>12 derniers mois</strong> précédant le fait générateur du dommage.</p>
      <h3>15.4 Disponibilité</h3>
      <p>Partnexx vise une disponibilité de la Plateforme de <strong>99,5 %</strong> en moyenne mensuelle, hors opérations de maintenance planifiées (notifiées au moins 48h à l&apos;avance) et hors cas de force majeure.</p>

      <h2 id="force-majeure">16. Force majeure</h2>
      <p>Aucune des parties ne pourra être tenue responsable d&apos;un manquement à ses obligations résultant d&apos;un cas de force majeure au sens de l&apos;article 1218 du Code civil, incluant notamment : pannes d&apos;infrastructure tierce, attaques informatiques massives, décisions gouvernementales, pandémies, guerres, catastrophes naturelles.</p>

      <h2 id="resiliation">17. Suspension et résiliation</h2>
      <h3>17.1 Résiliation par l&apos;Utilisateur</h3>
      <p>L&apos;Utilisateur peut à tout moment supprimer son Compte depuis ses paramètres. La résiliation prend effet immédiatement, sauf pour les Missions en cours qui doivent être menées à leur terme.</p>
      <h3>17.2 Résiliation par Partnexx</h3>
      <p>Partnexx peut suspendre ou résilier un Compte, sans préavis ni indemnité, en cas de :</p>
      <ul>
        <li>manquement grave aux présentes CGU ;</li>
        <li>fraude, tentative de fraude ou utilisation abusive de la Plateforme ;</li>
        <li>défaut de paiement persistant ;</li>
        <li>comportement nuisible à la communauté ou à la réputation de Partnexx ;</li>
        <li>injonction d&apos;une autorité administrative ou judiciaire.</li>
      </ul>
      <h3>17.3 Conséquences de la résiliation</h3>
      <p>La résiliation entraîne la suppression du Compte et des données associées dans les délais légaux. Les Missions en cours sont menées à leur terme ou annulées selon les conditions de l&apos;article 8.3. Aucun remboursement d&apos;abonnement n&apos;est dû en cas de résiliation par Partnexx pour faute de l&apos;Utilisateur.</p>

      <h2 id="donnees">18. Données personnelles et cookies</h2>
      <p>Le traitement des données personnelles est détaillé dans notre <a href="/politique-confidentialite">Politique de confidentialité</a>, conforme au RGPD et à la loi Informatique et Libertés. L&apos;utilisation des cookies est encadrée par notre bandeau de consentement.</p>

      <h2 id="confidentialite">19. Confidentialité</h2>
      <p>Chaque partie s&apos;engage à conserver confidentielles toutes les informations non publiques échangées dans le cadre de l&apos;utilisation de la Plateforme, notamment les Briefs, stratégies marketing, données d&apos;audience, tarifs et négociations. Cette obligation perdure <strong>3 ans</strong> après la cessation des relations.</p>

      <h2 id="assurance">20. Assurance et fiscalité</h2>
      <h3>20.1 Assurance</h3>
      <p>Partnexx est assuré au titre de sa responsabilité civile professionnelle. Les Marques sont invitées à souscrire une assurance couvrant leurs campagnes. Les Créateurs professionnels sont invités à souscrire une assurance RC Pro couvrant leur activité.</p>
      <h3>20.2 Fiscalité</h3>
      <p>Conformément au décret n° 2019-1185, Partnexx peut être tenu de transmettre à l&apos;administration fiscale française un récapitulatif annuel des Rémunérations versées aux Créateurs résidents fiscaux français dépassant certains seuils.</p>

      <h2 id="cession">21. Cession et sous-traitance</h2>
      <p>Partnexx peut céder ou transférer les présentes CGU à tout tiers, notamment dans le cadre d&apos;une opération de fusion, scission ou cession d&apos;activité, sans accord préalable de l&apos;Utilisateur. Partnexx peut recourir à des sous-traitants pour la fourniture de tout ou partie des services, sans préjudice de sa responsabilité directe.</p>

      <h2 id="droit">22. Droit applicable et juridiction</h2>
      <p>Les présentes CGU sont soumises au <strong>droit français</strong>. En cas de litige et à défaut de résolution amiable, les <strong>tribunaux de Paris</strong> seront seuls compétents, y compris en cas de pluralité de défendeurs ou d&apos;appel en garantie. Cette clause attributive de juridiction ne s&apos;applique pas aux Utilisateurs consommateurs, qui pourront saisir la juridiction française compétente selon les règles de droit commun.</p>

      <h2 id="mediation">23. Médiation et règlement des litiges</h2>
      <p>Conformément à l&apos;article L.616-1 du Code de la consommation, l&apos;Utilisateur consommateur peut recourir gratuitement à un médiateur de la consommation en cas de litige.</p>
      <p>La Commission européenne met également à disposition une plateforme de règlement en ligne des litiges accessible à l&apos;adresse : ec.europa.eu/consumers/odr.</p>

      <h2 id="diverses">24. Dispositions diverses</h2>
      <h3>24.1 Intégralité</h3>
      <p>Les présentes CGU constituent l&apos;intégralité de l&apos;accord entre les parties et annulent tout accord, écrit ou verbal, antérieur portant sur le même objet.</p>
      <h3>24.2 Nullité partielle</h3>
      <p>Si une stipulation des CGU était déclarée nulle ou inapplicable, les autres stipulations conserveraient leur plein effet.</p>
      <h3>24.3 Renonciation</h3>
      <p>Le fait pour Partnexx de ne pas se prévaloir d&apos;un manquement de l&apos;Utilisateur ne saurait valoir renonciation à s&apos;en prévaloir ultérieurement.</p>
      <h3>24.4 Notifications</h3>
      <p>Toute notification entre les parties peut valablement être effectuée par email aux adresses renseignées dans le Compte.</p>

      <h2 id="contact">25. Contact</h2>
      <p>Pour toute question relative aux présentes CGU : <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></p>
      <p>Pour toute question relative à votre Compte ou aux services : <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></p>
    </LegalLayout>
  );
}