import LegalLayout from "@/components/sections/LegalLayout";

const TOC = [
  { id: "preambule", label: "Préambule et engagement" },
  { id: "responsable", label: "Responsable du traitement et DPO" },
  { id: "definitions", label: "Définitions clés" },
  { id: "champ", label: "Champ d'application" },
  { id: "donnees-collectees", label: "Données personnelles collectées" },
  { id: "sources", label: "Sources des données" },
  { id: "finalites", label: "Finalités des traitements" },
  { id: "bases-legales", label: "Bases légales des traitements" },
  { id: "durees", label: "Durées de conservation" },
  { id: "destinataires", label: "Destinataires des données" },
  { id: "sous-traitants", label: "Sous-traitants et prestataires" },
  { id: "transferts", label: "Transferts hors UE" },
  { id: "cookies", label: "Cookies et traceurs" },
  { id: "securite", label: "Mesures de sécurité" },
  { id: "droits", label: "Vos droits RGPD" },
  { id: "exercice", label: "Exercice de vos droits" },
  { id: "cnil", label: "Réclamation auprès de la CNIL" },
  { id: "profilage", label: "Profilage et décisions automatisées" },
  { id: "mineurs", label: "Données des mineurs" },
  { id: "violations", label: "Violations de données" },
  { id: "reseaux", label: "Réseaux sociaux et tiers" },
  { id: "modifications", label: "Modifications de la politique" },
  { id: "contact", label: "Contact" },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout
      eyebrow="Données personnelles · RGPD"
      title="Politique de confidentialité"
      lastUpdate="10 mai 2026"
      version="2.0"
      toc={TOC}
    >
      <h2 id="preambule">1. Préambule et engagement</h2>
      <p>Chez Partnexx, la protection de vos données personnelles est une priorité absolue. Nous nous engageons à traiter vos données dans le respect le plus strict du Règlement (UE) 2016/679 du 27 avril 2016 (« RGPD »), de la loi n° 78-17 du 6 janvier 1978 modifiée dite « Informatique et Libertés », des recommandations de la CNIL et de la jurisprudence européenne.</p>
      <p>La présente politique a pour objet de vous informer de manière claire, transparente et accessible sur la nature des données que nous collectons, les raisons de leur collecte, leur durée de conservation, leurs destinataires et les droits dont vous disposez.</p>
      <p>Cette politique s&apos;applique à toute personne (Créateur, Marque, prospect, visiteur) qui utilise la plateforme Partnexx, ses sites, ses applications ou interagit avec Partnexx d&apos;une quelconque manière.</p>

      <h2 id="responsable">2. Responsable du traitement et DPO</h2>
      <h3>2.1 Responsable du traitement</h3>
      <p>Le responsable du traitement est <strong>Partnexx SAS</strong>, société par actions simplifiée immatriculée au RCS de Paris.</p>
      <ul>
        <li><strong>Siège social :</strong> Paris, France</li>
        <li><strong>Email général :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Email données personnelles :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
      </ul>
      <h3>2.2 Délégué à la Protection des Données (DPO)</h3>
      <p>Conformément aux articles 37 et suivants du RGPD, Partnexx a désigné un Délégué à la Protection des Données (DPO) que vous pouvez contacter à tout moment pour toute question relative à vos données personnelles : <a href="mailto:legal@partnexx.com">legal@partnexx.com</a>.</p>

      <h2 id="definitions">3. Définitions clés</h2>
      <ul>
        <li><strong>Donnée personnelle :</strong> toute information se rapportant à une personne physique identifiée ou identifiable.</li>
        <li><strong>Traitement :</strong> toute opération effectuée sur des données (collecte, enregistrement, conservation, modification, communication, suppression…).</li>
        <li><strong>Responsable du traitement :</strong> entité qui détermine les finalités et les moyens du traitement.</li>
        <li><strong>Sous-traitant :</strong> entité qui traite les données pour le compte du responsable.</li>
        <li><strong>Personne concernée :</strong> individu auquel se rapportent les données.</li>
        <li><strong>Consentement :</strong> manifestation de volonté libre, spécifique, éclairée et univoque.</li>
        <li><strong>Profilage :</strong> utilisation automatisée de données pour évaluer certains aspects personnels.</li>
      </ul>

      <h2 id="champ">4. Champ d&apos;application</h2>
      <p>Cette politique s&apos;applique à l&apos;ensemble des traitements mis en œuvre par Partnexx dans le cadre de :</p>
      <ul>
        <li>la consultation et la navigation sur le site partnexx.com et ses sous-domaines ;</li>
        <li>la création et l&apos;utilisation d&apos;un compte Créateur ou Marque ;</li>
        <li>la publication, la candidature et l&apos;exécution de Missions ;</li>
        <li>les paiements et la facturation ;</li>
        <li>les échanges avec le support client et les communications commerciales ;</li>
        <li>les candidatures spontanées et processus de recrutement.</li>
      </ul>

      <h2 id="donnees-collectees">5. Données personnelles collectées</h2>
      <h3>5.1 Données d&apos;identification</h3>
      <ul>
        <li>Civilité, nom, prénom, date de naissance</li>
        <li>Adresse email, numéro de téléphone</li>
        <li>Identifiants de connexion et mot de passe (chiffré via bcrypt)</li>
        <li>Photo de profil</li>
      </ul>
      <h3>5.2 Données de profil Créateur</h3>
      <ul>
        <li>Pseudo, biographie, niche, langue</li>
        <li>Réseaux sociaux et statistiques d&apos;audience</li>
        <li>Exemples de contenus, portfolio</li>
        <li>Tarifs, disponibilité, géolocalisation déclarée</li>
        <li>Partnexx Score et historique de Missions</li>
      </ul>
      <h3>5.3 Données de profil Marque</h3>
      <ul>
        <li>Raison sociale, SIRET, numéro de TVA, secteur d&apos;activité</li>
        <li>Coordonnées professionnelles du contact</li>
        <li>Logo, charte de marque, briefs publiés</li>
      </ul>
      <h3>5.4 Données financières</h3>
      <ul>
        <li>IBAN du Créateur (pour le versement des Rémunérations)</li>
        <li>Coordonnées de facturation des Marques</li>
        <li>Historique des transactions, factures</li>
      </ul>
      <p>Les coordonnées bancaires complètes (cartes) ne sont <strong>jamais stockées</strong> par Partnexx ; elles sont gérées exclusivement par notre prestataire certifié PCI-DSS niveau 1, <strong>Stripe</strong>.</p>
      <h3>5.5 Données techniques</h3>
      <ul>
        <li>Adresse IP, type de navigateur, système d&apos;exploitation</li>
        <li>Identifiants de session, cookies</li>
        <li>Logs de connexion (date, heure, page)</li>
        <li>Données de l&apos;appareil utilisé</li>
      </ul>
      <h3>5.6 Données d&apos;usage et comportementales</h3>
      <ul>
        <li>Pages consultées, temps passé, clics, parcours</li>
        <li>Missions consultées et candidatures</li>
        <li>Interactions avec le support et les emails</li>
        <li>Préférences et paramètres</li>
      </ul>
      <h3>5.7 Données de communication</h3>
      <ul>
        <li>Échanges via la messagerie de la Plateforme</li>
        <li>Contenu des emails échangés avec le support</li>
        <li>Avis et notations laissés sur la Plateforme</li>
      </ul>
      <h3>5.8 Catégories de données sensibles</h3>
      <p>Partnexx <strong>ne collecte pas</strong> intentionnellement de données dites « sensibles » (origine raciale, opinions politiques, convictions religieuses, données de santé, orientation sexuelle, etc.). Si de telles données figurent dans le contenu publié par les Utilisateurs, elles le sont sous leur seule responsabilité.</p>

      <h2 id="sources">6. Sources des données</h2>
      <p>Les données sont collectées :</p>
      <ul>
        <li><strong>Directement auprès de vous :</strong> lors de l&apos;inscription, du remplissage de votre profil, des échanges avec le support, des Missions, etc.</li>
        <li><strong>Automatiquement :</strong> via les cookies, traceurs et outils d&apos;analytics lorsque vous utilisez la Plateforme.</li>
        <li><strong>Via des sources tierces :</strong> connexion via vos comptes réseaux sociaux (Instagram, TikTok, YouTube), API publiques d&apos;audience, partenaires commerciaux ayant obtenu votre consentement.</li>
      </ul>

      <h2 id="finalites">7. Finalités des traitements</h2>
      <p>Vos données sont traitées pour les finalités suivantes :</p>
      <h3>7.1 Gestion du compte et des services</h3>
      <ul>
        <li>Création, authentification et gestion du Compte</li>
        <li>Mise en relation Créateurs / Marques (matching)</li>
        <li>Exécution des Missions et workflow de validation</li>
        <li>Calcul du Partnexx Score et des recommandations</li>
      </ul>
      <h3>7.2 Paiements et facturation</h3>
      <ul>
        <li>Encaissement des abonnements Marques</li>
        <li>Versement des Rémunérations aux Créateurs</li>
        <li>Émission des factures et reçus</li>
        <li>Lutte contre la fraude et le blanchiment</li>
      </ul>
      <h3>7.3 Communication</h3>
      <ul>
        <li>Notifications transactionnelles (mission, paiement, validation)</li>
        <li>Réponses du support client</li>
        <li>Newsletter et communications marketing (sous réserve de consentement)</li>
      </ul>
      <h3>7.4 Amélioration et analytics</h3>
      <ul>
        <li>Mesure d&apos;audience et statistiques anonymisées</li>
        <li>Tests A/B et amélioration de l&apos;UX</li>
        <li>Détection de bugs et incidents</li>
      </ul>
      <h3>7.5 Conformité légale</h3>
      <ul>
        <li>Respect des obligations comptables et fiscales</li>
        <li>Lutte anti-fraude et anti-blanchiment (KYC, LCB-FT)</li>
        <li>Réponses aux réquisitions des autorités habilitées</li>
      </ul>

      <h2 id="bases-legales">8. Bases légales des traitements</h2>
      <p>Conformément à l&apos;article 6 du RGPD, chaque traitement repose sur une base légale précise :</p>
      <ul>
        <li><strong>Exécution du contrat (art. 6.1.b) :</strong> gestion du Compte, exécution des Missions, paiements.</li>
        <li><strong>Consentement (art. 6.1.a) :</strong> cookies non essentiels, communications marketing, connexion via réseaux sociaux.</li>
        <li><strong>Obligation légale (art. 6.1.c) :</strong> conservation comptable, déclarations fiscales, KYC/LCB-FT.</li>
        <li><strong>Intérêt légitime (art. 6.1.f) :</strong> sécurité de la Plateforme, prévention de la fraude, amélioration des services, prospection B2B.</li>
      </ul>
      <p>Pour les traitements fondés sur l&apos;intérêt légitime, vous disposez d&apos;un droit d&apos;opposition que vous pouvez exercer à tout moment.</p>
      <h2 id="durees">9. Durées de conservation</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border border-border rounded-xl overflow-hidden">
          <thead className="bg-secondary/40">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-bold text-foreground border-b border-border">Catégorie</th>
              <th className="text-left px-4 py-3 text-sm font-bold text-foreground border-b border-border">Durée</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-border"><td className="px-4 py-3">Compte actif</td><td className="px-4 py-3 font-semibold">Pendant toute la durée d&apos;utilisation</td></tr>
            <tr className="border-b border-border bg-secondary/20"><td className="px-4 py-3">Compte inactif</td><td className="px-4 py-3 font-semibold">3 ans après la dernière connexion</td></tr>
            <tr className="border-b border-border"><td className="px-4 py-3">Données de prospection</td><td className="px-4 py-3 font-semibold">3 ans à compter du dernier contact</td></tr>
            <tr className="border-b border-border bg-secondary/20"><td className="px-4 py-3">Données de facturation</td><td className="px-4 py-3 font-semibold">10 ans (obligation légale)</td></tr>
            <tr className="border-b border-border"><td className="px-4 py-3">Logs de connexion</td><td className="px-4 py-3 font-semibold">12 mois</td></tr>
            <tr className="border-b border-border bg-secondary/20"><td className="px-4 py-3">Cookies</td><td className="px-4 py-3 font-semibold">13 mois maximum</td></tr>
            <tr className="border-b border-border"><td className="px-4 py-3">KYC / LCB-FT</td><td className="px-4 py-3 font-semibold">5 ans après fin de la relation</td></tr>
            <tr className="bg-secondary/20"><td className="px-4 py-3">Sauvegardes chiffrées</td><td className="px-4 py-3 font-semibold">90 jours après suppression</td></tr>
          </tbody>
        </table>
      </div>
      <p>À l&apos;expiration de ces durées, les données sont soit supprimées, soit anonymisées de manière irréversible à des fins statistiques.</p>

      <h2 id="destinataires">10. Destinataires des données</h2>
      <p>Vos données sont accessibles, dans la limite de leurs attributions, aux :</p>
      <ul>
        <li>équipes Partnexx habilitées (produit, support, finance, conformité) ;</li>
        <li>contreparties dans le cadre des Missions (Créateur ↔ Marque) ;</li>
        <li>sous-traitants techniques (hébergement, paiement, emailing, analytics) ;</li>
        <li>autorités administratives et judiciaires sur réquisition légale ;</li>
        <li>tiers en cas de cession d&apos;activité (sous réserve de garanties équivalentes).</li>
      </ul>
      <p><strong>Aucune donnée n&apos;est vendue ni louée à des tiers à des fins commerciales.</strong></p>

      <h2 id="sous-traitants">11. Sous-traitants et prestataires</h2>
      <p>Partnexx fait appel aux sous-traitants suivants, tous engagés contractuellement au respect du RGPD :</p>
      <ul>
        <li><strong>Vercel</strong> (USA) — hébergement frontend</li>
        <li><strong>Supabase</strong> (UE) — base de données, authentification, stockage</li>
        <li><strong>Stripe</strong> (Irlande / USA) — paiements</li>
        <li><strong>Resend</strong> (USA) — envoi d&apos;emails transactionnels</li>
        <li><strong>Plausible / PostHog</strong> (UE) — analytics respectueux de la vie privée</li>
        <li><strong>Sentry</strong> (USA) — monitoring d&apos;erreurs</li>
        <li><strong>Intercom / Crisp</strong> — support client</li>
      </ul>
      <p>La liste complète et à jour des sous-traitants est disponible sur simple demande auprès du DPO.</p>

      <h2 id="transferts">12. Transferts hors UE</h2>
      <p>Certains de nos sous-traitants sont établis hors de l&apos;Union européenne, notamment aux États-Unis. Dans ce cas, Partnexx s&apos;assure que les transferts sont encadrés par des garanties appropriées :</p>
      <ul>
        <li>décision d&apos;adéquation de la Commission européenne (notamment EU-US Data Privacy Framework) ;</li>
        <li>clauses contractuelles types (CCT) adoptées par la Commission européenne ;</li>
        <li>mesures techniques complémentaires (chiffrement, pseudonymisation).</li>
      </ul>

      <h2 id="cookies">13. Cookies et traceurs</h2>
      <h3>13.1 Qu&apos;est-ce qu&apos;un cookie ?</h3>
      <p>Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d&apos;un site. Il permet notamment d&apos;assurer le bon fonctionnement du site, de mesurer l&apos;audience et de personnaliser le contenu.</p>
      <h3>13.2 Catégories utilisées</h3>
      <ul>
        <li><strong>Cookies essentiels :</strong> indispensables au fonctionnement (authentification, sécurité, panier). Ne nécessitent pas de consentement.</li>
        <li><strong>Cookies de mesure d&apos;audience :</strong> statistiques d&apos;utilisation. Soumis au consentement sauf exemption CNIL.</li>
        <li><strong>Cookies de personnalisation :</strong> préférences d&apos;affichage. Soumis au consentement.</li>
        <li><strong>Cookies marketing :</strong> publicité ciblée et retargeting. Soumis au consentement explicite.</li>
      </ul>
      <h3>13.3 Gestion des préférences</h3>
      <p>Vous pouvez à tout moment modifier vos préférences cookies via le bandeau de consentement ou les paramètres de votre navigateur. Le retrait du consentement n&apos;affecte pas la licéité des traitements antérieurs.</p>

      <h2 id="securite">14. Mesures de sécurité</h2>
      <p>Partnexx met en œuvre des mesures techniques et organisationnelles appropriées pour garantir la confidentialité, l&apos;intégrité et la disponibilité de vos données :</p>
      <ul>
        <li>chiffrement des données en transit (TLS 1.3) et au repos (AES-256) ;</li>
        <li>hashage des mots de passe (bcrypt avec salage individuel) ;</li>
        <li>contrôle d&apos;accès strict basé sur les rôles (RBAC) ;</li>
        <li>authentification à deux facteurs (2FA) disponible pour tous les Comptes ;</li>
        <li>audits de sécurité réguliers et tests d&apos;intrusion annuels ;</li>
        <li>sauvegardes chiffrées et redondées dans plusieurs zones géographiques ;</li>
        <li>journalisation et monitoring des accès aux données ;</li>
        <li>formation continue des équipes à la sécurité et à la confidentialité.</li>
      </ul>

      <h2 id="droits">15. Vos droits RGPD</h2>
      <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants sur vos données personnelles :</p>
      <h3>15.1 Droit d&apos;accès (art. 15)</h3>
      <p>Obtenir confirmation que vos données sont traitées et en recevoir une copie.</p>
      <h3>15.2 Droit de rectification (art. 16)</h3>
      <p>Demander la correction de données inexactes ou incomplètes.</p>
      <h3>15.3 Droit à l&apos;effacement (art. 17)</h3>
      <p>Demander la suppression de vos données, sous réserve des obligations légales de conservation.</p>
      <h3>15.4 Droit à la limitation (art. 18)</h3>
      <p>Demander le gel temporaire de l&apos;utilisation de vos données.</p>
      <h3>15.5 Droit à la portabilité (art. 20)</h3>
      <p>Recevoir vos données dans un format structuré, couramment utilisé et lisible par machine, et les transmettre à un autre responsable de traitement.</p>
      <h3>15.6 Droit d&apos;opposition (art. 21)</h3>
      <p>Vous opposer à un traitement fondé sur l&apos;intérêt légitime ou à des fins de prospection commerciale.</p>
      <h3>15.7 Droit de retirer le consentement</h3>
      <p>Retirer à tout moment votre consentement aux traitements qui en dépendent.</p>
      <h3>15.8 Droit de définir le sort post-mortem (art. 85 LIL)</h3>
      <p>Définir des directives relatives au sort de vos données après votre décès.</p>
      <h3>15.9 Droit de ne pas faire l&apos;objet d&apos;une décision automatisée (art. 22)</h3>
      <p>Demander une intervention humaine sur toute décision produisant des effets juridiques vous concernant.</p>

      <h2 id="exercice">16. Exercice de vos droits</h2>
      <p>Pour exercer vos droits, contactez-nous :</p>
      <ul>
        <li>par email : <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li>via le formulaire dédié dans les paramètres de votre Compte ;</li>
        <li>par courrier au siège social.</li>
      </ul>
      <p>Pour des raisons de sécurité, nous pourrons être amenés à vous demander de justifier votre identité. Une réponse vous sera apportée dans un délai maximum d&apos;un mois à compter de la réception de votre demande, prolongeable de deux mois en cas de complexité particulière (vous en serez alors informé).</p>
      <p>L&apos;exercice de vos droits est gratuit, sauf demande manifestement infondée ou excessive.</p>

      <h2 id="cnil">17. Réclamation auprès de la CNIL</h2>
      <p>Si vous estimez que vos droits ne sont pas respectés, vous disposez du droit d&apos;introduire une réclamation auprès de la <strong>Commission Nationale de l&apos;Informatique et des Libertés (CNIL)</strong> :</p>
      <ul>
        <li><strong>Adresse :</strong> 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
        <li><strong>Téléphone :</strong> 01 53 73 22 22</li>
        <li><strong>Site :</strong> www.cnil.fr</li>
      </ul>

      <h2 id="profilage">18. Profilage et décisions automatisées</h2>
      <p>Partnexx met en œuvre certains traitements automatisés, notamment :</p>
      <ul>
        <li>le matching IA entre Créateurs et Missions ;</li>
        <li>le calcul du Partnexx Score ;</li>
        <li>la détection de comportements suspects (anti-fraude).</li>
      </ul>
      <p>Ces traitements <strong>ne produisent pas de décisions juridiques</strong> sans intervention humaine. Toute décision impactante (suspension de Compte, refus de paiement) fait systématiquement l&apos;objet d&apos;une revue humaine. Vous pouvez à tout moment demander des explications sur la logique sous-jacente et contester la décision auprès de notre DPO.</p>

      <h2 id="mineurs">19. Données des mineurs</h2>
      <p>La Plateforme est ouverte aux Créateurs mineurs <strong>à partir de 16 ans</strong>, sous réserve de l&apos;accord exprès de leur représentant légal. En dessous de 16 ans, l&apos;inscription est strictement interdite. Si nous constatons qu&apos;un Compte a été créé en violation de cette règle, nous procéderons à sa suppression sans délai.</p>

      <h2 id="violations">20. Violations de données</h2>
      <p>En cas de violation de données susceptible d&apos;engendrer un risque pour vos droits et libertés, Partnexx s&apos;engage à :</p>
      <ul>
        <li>notifier la violation à la CNIL dans les <strong>72 heures</strong> conformément à l&apos;article 33 du RGPD ;</li>
        <li>vous informer dans les meilleurs délais en cas de risque élevé (article 34) ;</li>
        <li>mettre en œuvre toutes les mesures correctrices nécessaires.</li>
      </ul>

      <h2 id="reseaux">21. Réseaux sociaux et tiers</h2>
      <p>La Plateforme peut intégrer des modules de réseaux sociaux (boutons de partage, intégration TikTok / Instagram / YouTube). Ces tiers peuvent collecter des données indépendamment de Partnexx, selon leurs propres politiques de confidentialité que nous vous invitons à consulter.</p>

      <h2 id="modifications">22. Modifications de la politique</h2>
      <p>Cette politique peut être mise à jour pour refléter des évolutions légales, techniques ou fonctionnelles. Toute modification substantielle vous sera notifiée par email et/ou via une notification sur la Plateforme au moins <strong>15 jours</strong> avant son entrée en vigueur. Une version archivée des précédentes politiques est conservée et peut vous être communiquée sur demande.</p>

      <h2 id="contact">23. Contact</h2>
      <ul>
        <li><strong>Questions générales :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Données personnelles :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>DPO :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
        <li><strong>Signalement abus :</strong> <a href="mailto:legal@partnexx.com">legal@partnexx.com</a></li>
      </ul>
    </LegalLayout>
  );
}