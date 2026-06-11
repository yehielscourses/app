#!/usr/bin/env python3
"""Generate comprehensive philosophy QCM data for the Bac programme."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from philo_pedagogie import LEARNING_CARDS_GLOBAL, NEUROPSY_PROFILE, NOTION_PEDAGOGIE, PERSPECTIVES

NOTIONS = [
    ("art", "L'art", "L'existence humaine et la culture"),
    ("bonheur", "Le bonheur", "L'existence humaine et la culture"),
    ("conscience", "La conscience", "L'existence humaine et la culture"),
    ("inconscient", "L'inconscient", "L'existence humaine et la culture"),
    ("nature", "La nature", "L'existence humaine et la culture"),
    ("religion", "La religion", "L'existence humaine et la culture"),
    ("technique", "La technique", "L'existence humaine et la culture"),
    ("temps", "Le temps", "L'existence humaine et la culture"),
    ("travail", "Le travail", "L'existence humaine et la culture"),
    ("devoir", "Le devoir", "La morale et la politique"),
    ("etat", "L'État", "La morale et la politique"),
    ("justice", "La justice", "La morale et la politique"),
    ("liberte", "La liberté", "La morale et la politique"),
    ("langage", "Le langage", "La connaissance"),
    ("raison", "La raison", "La connaissance"),
    ("science", "La science", "La connaissance"),
    ("verite", "La vérité", "La connaissance"),
]

PERSPECTIVES = [
    ("existence", "L'existence humaine et la culture"),
    ("morale", "La morale et la politique"),
    ("connaissance", "La connaissance"),
]

EXTRA_THEMES = [
    ("methodologie", "Méthodologie", "school", None),
    ("citations", "Citations essentielles", "format_quote", None),
    ("reperes", "Repères philosophiques", "compare_arrows", None),
]

# (id_suffix, importance, prompt, choices, correct_index, explanation)
METHODOLOGIE = [
    ("epreuve-format", 3,
     "Quelle est la durée de l'épreuve de philosophie au baccalauréat (voie générale) ?",
     ["2 heures", "3 heures", "4 heures", "5 heures"], 2,
     "L'épreuve dure 4 heures avec un coefficient 8 en voie générale."),
    ("epreuve-choix", 3,
     "Quels sont les deux types d'exercices proposés au bac de philo ?",
     ["Commentaire et résumé", "Dissertation et explication de texte", "Synthèse et note de synthèse", "Étude de cas et dissertation"], 1,
     "Le candidat choisit entre une dissertation et une explication de texte."),
    ("dissertation-plan", 3,
     "Quel type de plan est attendu dans une dissertation de philosophie ?",
     ["Plan thématique en trois parties", "Plan dialectique : thèse, antithèse, dépassement", "Plan chronologique", "Plan comparatif à deux auteurs"], 1,
     "Le plan dialectique (I thèse, II antithèse, III dépassement) est la structure classique attendue."),
    ("dissertation-intro", 3,
     "Que doit contenir l'introduction d'une dissertation ?",
     ["Uniquement la problématique", "Accroche, définitions, problématique et annonce du plan", "Le plan détaillé de chaque partie", "Une biographie de l'auteur"], 1,
     "L'introduction accroche, définit les termes, pose la problématique et annonce le plan."),
    ("dissertation-conclusion", 2,
     "Que doit faire la conclusion d'une dissertation ?",
     ["Introduire de nouveaux arguments", "Bilan, réponse à la problématique et ouverture", "Résumer mot à mot l'introduction", "Citer un maximum d'auteurs"], 1,
     "La conclusion fait le bilan, répond à la problématique et propose une ouverture."),
    ("explication-intro", 3,
     "Que doit contenir l'introduction d'une explication de texte ?",
     ["Une critique du texte", "Situation de l'auteur, contexte et fil directeur", "Un plan dialectique", "Une liste de citations"], 1,
     "On situe l'auteur, le contexte et on annonce le fil directeur de l'explication."),
    ("explication-lineaire", 3,
     "Qu'est-ce qu'une explication linéaire ?",
     ["Un résumé du texte", "Une analyse qui suit le texte phrase par phrase ou par groupes", "Une discussion critique du texte", "Une comparaison avec un autre auteur"], 1,
     "L'explication linéaire suit l'ordre du texte en expliquant chaque passage."),
    ("explication-discussion", 2,
     "Quelle est la différence entre explication et discussion dans l'explication de texte ?",
     ["Il n'y en a pas", "L'explication dit ce que l'auteur affirme ; la discussion critique ou prolonge", "La discussion précède l'explication", "L'explication est subjective, la discussion objective"], 1,
     "L'explication restitue le sens du texte ; la discussion en apprécie la portée."),
    ("problematique", 3,
     "Qu'est-ce qu'une problématique en dissertation ?",
     ["La question à laquelle le sujet invite à répondre", "Le titre du sujet recopié", "La thèse défendue", "La liste des auteurs cités"], 0,
     "La problématique reformule le sujet en question philosophique précise."),
    ("auteur-usage", 2,
     "Comment doit-on utiliser les auteurs dans une dissertation ?",
     ["Les citer le plus possible sans les expliquer", "Chaque référence doit servir l'argument", "N'en citer qu'un seul par partie", "Les citer uniquement en conclusion"], 1,
     "Éviter le catalogue d'auteurs : chaque référence doit soutenir l'argumentation."),
    ("coefficient", 2,
     "Quel est le coefficient de l'épreuve de philosophie en voie générale ?",
     ["4", "6", "8", "10"], 2,
     "Le coefficient est 8 en voie générale."),
    ("perspectives", 2,
     "Combien de perspectives structurent le programme officiel de terminale ?",
     ["2", "3", "4", "5"], 1,
     "Les trois perspectives : existence et culture, morale et politique, connaissance."),
    ("perspective-existence", 2,
     "Quelles notions appartiennent à la perspective « L'existence humaine et la culture » ?",
     ["Liberté, justice, devoir", "Art, bonheur, technique, religion", "Raison, science, vérité", "État, droit, politique"], 1,
     "Art, bonheur, conscience, inconscient, nature, religion, technique, temps, travail."),
    ("perspective-morale", 2,
     "Quelles notions appartiennent à la perspective « La morale et la politique » ?",
     ["Langage, raison, science", "Devoir, État, justice, liberté", "Art, technique, travail", "Religion, conscience, temps"], 1,
     "Devoir, État, justice et liberté forment cette perspective."),
    ("perspective-connaissance", 2,
     "Quelles notions appartiennent à la perspective « La connaissance » ?",
     ["Bonheur, nature, religion", "Langage, raison, science, vérité", "Liberté, justice, devoir", "Technique, travail, art"], 1,
     "Langage, raison, science et vérité appartiennent à la perspective connaissance."),
]

CITATIONS = [
    ("descartes-cogito", 3, "« Je pense, donc je suis »", "Descartes", ["Spinoza", "Descartes", "Locke", "Hume"], 1,
     "Formule du cogito dans les Méditations métaphysiques (Descartes)."),
    ("kant-devoir", 3, "« Agis uniquement d'après la maxime qui peut valoir loi universelle »", "Kant", ["Mill", "Kant", "Rousseau", "Hegel"], 1,
     "Formulation de l'impératif catégorique (Kant, Fondement de la métaphysique des mœurs)."),
    ("kant-fin", 3, "« Agis de telle sorte que tu traites l'humanité toujours en même temps comme une fin, jamais simplement comme un moyen »", "Kant", ["Kant", "Rawls", "Mill", "Hobbes"], 0,
     "Deuxième formulation de l'impératif catégorique (Kant)."),
    ("sartre-liberte", 3, "« L'homme est condamné à être libre »", "Sartre", ["Sartre", "Spinoza", "Kant", "Mill"], 0,
     "L'Existentialisme est un humanisme (Sartre, 1946)."),
    ("hobbes-loup", 3, "« L'homme est un loup pour l'homme »", "Hobbes", ["Rousseau", "Hobbes", "Locke", "Marx"], 1,
     "Attribué à Hobbes (De cive) pour décrire l'état de nature."),
    ("rousseau-libre", 3, "« L'homme naît libre, et partout il est dans les fers »", "Rousseau", ["Hobbes", "Locke", "Rousseau", "Montesquieu"], 2,
     "Première phrase du Contrat social (Rousseau, 1762)."),
    ("marx-opium", 3, "« La religion est l'opium du peuple »", "Marx", ["Feuerbach", "Marx", "Weber", "Freud"], 1,
     "Contribution à la critique de la philosophie du droit de Hegel (Marx, 1844)."),
    ("freud-maitresse", 3, "« La conscience n'est pas maîtresse en sa maison »", "Freud", ["Freud", "Jung", "Lacan", "Sartre"], 0,
     "Une difficulté de la psychanalyse (Freud, 1917)."),
    ("platon-justice", 2, "« La justice, c'est donner à chacun ce qui lui revient »", "Platon", ["Aristote", "Platon", "Rawls", "Mill"], 1,
     "La République (Platon) — définition classique de la justice."),
    ("aristote-bonheur", 3, "« Le bonheur est l'activité de l'âme conforme à la vertu »", "Aristote", ["Épicure", "Aristote", "Kant", "Mill"], 1,
     "Éthique à Nicomaque, livre I (Aristote)."),
    ("wittgenstein-limites", 3, "« Les limites de mon langage sont les limites de mon monde »", "Wittgenstein", ["Heidegger", "Wittgenstein", "Saussure", "Austin"], 1,
     "Tractatus logico-philosophicus (Wittgenstein, 1921)."),
    ("pascal-coeur", 2, "« Le cœur a ses raisons que la raison ne connaît point »", "Pascal", ["Pascal", "Descartes", "Kant", "Hume"], 0,
     "Pensées, fragment 277 (Pascal)."),
    ("heidegger-art", 2, "« L'art est l'activité qui permet à la vérité de prendre son essor »", "Heidegger", ["Platon", "Hegel", "Heidegger", "Adorno"], 2,
     "L'Origine de l'œuvre d'art (Heidegger)."),
    ("heidegger-science", 2, "« La science ne pense pas »", "Heidegger", ["Bacon", "Popper", "Heidegger", "Comte"], 2,
     "La question de la technique (Heidegger, 1953)."),
    ("heidegger-technique", 2, "« Partout où il y a la technique, il y a le danger »", "Heidegger", ["Ellul", "Jonas", "Heidegger", "Marx"], 2,
     "La question de la technique (Heidegger)."),
    ("nietzsche-faits", 3, "« Il n'y a pas de faits, il n'y a que des interprétations »", "Nietzsche", ["Nietzsche", "Descartes", "Kant", "Platon"], 0,
     "Fragment posthume (Nietzsche) — relativisme de la vérité."),
    ("augustin-temps", 2, "« Qu'est-ce donc que le temps ? Si personne ne m'interroge, je le sais ; si je veux l'expliquer, je ne le sais plus »", "Augustin", ["Kant", "Augustin", "Bergson", "Aristote"], 1,
     "Confessions, livre XI (Augustin)."),
    ("hegel-conscience", 2, "« La conscience fait l'unité de l'être en le rendant présent à soi »", "Hegel", ["Descartes", "Hegel", "Husserl", "Sartre"], 1,
     "Phénoménologie de l'esprit (Hegel)."),
    ("platon-grotte", 3, "L'allégorie de la caverne illustre principalement :", "Platon", ["Le bonheur stoïcien", "La distinction entre apparences et réalité intelligible", "L'impératif catégorique", "La volonté de puissance"], 1,
     "L'allégorie de la caverne (République, livre VII) oppose ombres et Idées."),
    ("aristote-politique", 2, "« L'homme est un animal politique »", "Aristote", ["Hobbes", "Rousseau", "Aristote", "Locke"], 2,
     "Politique, livre I (Aristote) — zôon politikon."),
    ("mill-socrate", 2, "« Mieux vaut être Socrate insatisfait qu'un imbécile satisfait »", "Mill", ["Aristote", "Épicure", "Mill", "Kant"], 2,
     "Utilitarisme (Mill) — qualité des plaisirs."),
    ("rawls-voile", 2, "Le « voile d'ignorance » est un concept de :", "Rawls", ["Nozick", "Rawls", "Hobbes", "Rousseau"], 1,
     "Théorie de la justice (Rawls, 1971) — choix des principes de justice."),
    ("popper-falsification", 2, "Pour Karl Popper, une théorie scientifique doit être :", "Popper", ["Vérifiable", "Réfutable (falsifiable)", "Indémontrable", "Métaphysique"], 1,
     "La logique de la recherche scientifique (Popper) — critère de falsifiabilité."),
    ("comte-positivisme", 2, "Auguste Comte défend le positivisme, selon lequel :", "Comte", ["La métaphysique prime sur la science", "La science remplace la métaphysique et la religion", "La religion est la seule voie de vérité", "L'art est supérieur à la science"], 1,
     "Cours de philosophie positive (Comte) — hiérarchie des sciences."),
    ("leibniz-meilleur", 2, "« Tout est pour le mieux dans le meilleur des mondes possibles » est associé à :", "Leibniz", ["Spinoza", "Leibniz", "Hume", "Kant"], 1,
     "Essais de théodicée (Leibniz) — optimisme rationnel."),
]

REPERES = [
    ("obj-subj", 2, "Que distingue le couple objectif / subjectif ?", ["Ce qui dépend du sujet vs ce qui est indépendant de lui", "Ce qui est vrai vs ce qui est faux", "Ce qui est légal vs ce qui est légitime", "Ce qui est universel vs ce qui est particulier"], 0,
     "Objectif : indépendant du sujet. Subjectif : relatif à la perception ou au jugement du sujet."),
    ("legal-legitime", 3, "Quelle est la distinction entre légal et légitime ?", ["Synonymes en philosophie du droit", "Légal = conforme à la loi ; légitime = moralement fondé", "Légitime = écrit ; légal = coutumier", "Légal = universel ; légitime = particulier"], 1,
     "Une loi peut être légale sans être légitime (ex. lois injustes)."),
    ("universel-particulier", 2, "Le couple universel / particulier concerne :", ["La portée d'une règle ou d'un jugement", "Le temps et l'espace", "La raison et la passion", "La théorie et la pratique"], 0,
     "L'universel s'applique à tous les cas ; le particulier à un cas singulier."),
    ("raison-passion", 3, "Hume affirme que la raison est :", ["Maîtresse des passions", "Esclave des passions", "Identique aux passions", "Sans rapport avec les passions"], 1,
     "Traité de la nature humaine (Hume) — la raison est et doit être esclave des passions."),
    ("theorie-pratique", 2, "La raison pratique (Kant) concerne :", ["Les mathématiques", "Le devoir et l'action morale", "La physique", "L'art abstrait"], 1,
     "Raison théorique = connaître ; raison pratique = agir moralement."),
    ("croyance-savoir", 2, "Quelle distinction oppose croyance et savoir ?", ["La croyance est toujours fausse", "Le savoir suppose une justification ou une certitude que la croyance n'a pas toujours", "Le savoir est subjectif", "La croyance est scientifique"], 1,
     "Le savoir philosophique exige généralement justification ; la croyance peut être sans preuve."),
    ("liberte-contrainte", 2, "Liberté négative (Berlin) désigne :", ["La capacité d'autonomie morale", "L'absence d'entraves extérieures", "La liberté de la volonté divine", "L'aliénation sociale"], 1,
     "Berlin distingue liberté négative (non-interférence) et positive (autonomie)."),
    ("obligation-contrainte", 2, "L'obligation morale se distingue de la contrainte physique car :", ["Elle est toujours plus forte", "Elle engage la liberté et la responsabilité du sujet", "Elle n'existe pas", "Elle est identique à la loi"], 1,
     "L'obligation morale s'impose intérieurement ; la contrainte s'exerce de l'extérieur."),
    ("persuader-convaincre", 2, "Convaincre (Platon) s'oppose à persuader car :", ["Convaincre utilise l'émotion", "Convaincre s'adresse à l'intellect par la démonstration", "Persuader est plus efficace", "Il n'y a pas de différence"], 1,
     "Convaincre = raison/démonstration ; persuader = rhétorique/émotion."),
    ("expliquer-comprendre", 2, "Dilthey distingue expliquer (Erklären) et comprendre (Verstehen) :", ["Ce sont des synonymes", "Expliquer = sciences de la nature ; comprendre = sciences de l'esprit", "Comprendre = physique ; expliquer = histoire", "Expliquer est subjectif"], 1,
     "Expliquer par causalité (nature) ; comprendre par sens (histoire, société)."),
    ("nature-culture", 3, "L'opposition nature / culture interroge :", ["Si l'homme est entièrement déterminé biologiquement", "Si l'acquis culturel dépasse ou corrompt l'inné", "Les deux réponses précédentes", "Uniquement la biologie"], 2,
     "Question centrale : l'homme est-il un animal naturel ou un être culturel ?"),
    ("idee-reel", 2, "Pour Platon, l'Idée (eidos) se rapporte au couple :", ["Idéal / réel", "Subjectif / objectif", "Légal / légitime", "Analyse / synthèse"], 0,
     "Les Idées sont le réel intelligible ; le monde sensible n'en est qu'une copie."),
    ("mediat-immediat", 2, "La connaissance médiat suppose :", ["Une intuition directe", "Un intermédiaire (concept, langage, sens)", "L'absence de raison", "La foi seule"], 1,
     "Connaissance immédiate = directe ; médiat = par un intermédiaire."),
    ("analyse-synthese", 2, "En méthode philosophique, analyser c'est :", ["Réunir les éléments", "Décomposer un tout en éléments", "Résumer un texte", "Critiquer un auteur"], 1,
     "Analyse = décomposer ; synthèse = recomposer en un tout cohérent."),
]

# Per-notion questions: (suffix, importance, prompt, choices, correct, explanation)
NOTION_QUESTIONS = {
    "art": [
        ("mimesis", 3, "Qu'est-ce que la mimesis chez Platon et Aristote ?", ["La création ex nihilo", "L'imitation de la nature ou des idées", "La destruction de l'art", "L'art pour l'art"], 1, "Mimesis = imitation ; Platon la critique, Aristote la valorise (tragédie)."),
        ("platon-art", 3, "Pourquoi Platon bannit-il les poètes de la Cité idéale ?", ["Parce qu'ils sont trop pauvres", "Parce que l'art imite les apparences, loin de la vérité", "Parce qu'ils sont étrangers", "Parce qu'ils refusent la politique"], 1, "L'art est une copie trompeuse des apparences (République)."),
        ("kant-beau", 2, "Pour Kant, le jugement de goût est :", ["Intéressé et utile", "Désintéressé", "Purement moral", "Relatif à chaque culture uniquement"], 1, "Critique de la faculté de juger — le beau est jugé sans intérêt."),
        ("catharsis", 2, "La catharsis aristotélicienne désigne :", ["La censure des passions", "La purification des passions par la tragédie", "L'imitation mécanique", "Le rejet de l'art"], 1, "Poétique — la tragédie purifie la pitié et la crainte."),
        ("art-verite", 2, "Heidegger affirme que l'œuvre d'art :", ["Est une simple décoration", "Ouvre un monde et fait apparaître la vérité", "Est une illusion totale", "Remplace la science"], 1, "L'art révèle l'être (aletheia) selon Heidegger."),
        ("art-moral", 2, "L'« art pour l'art » affirme que l'œuvre :", ["Doit être morale", "Vaut par elle-même, sans utilité extérieure", "Doit servir l'État", "Doit être religieuse"], 1, "Doctrine esthétique du XIXe siècle (Gautier, Wilde)."),
        ("hegel-art", 2, "Pour Hegel, l'art est :", ["Éternel et supérieur à tout", "Une forme de l'Esprit qui s'historise", "Une erreur", "Inférieur à la technique"], 1, "Esthétique — l'art exprime une époque avant de céder à la philosophie."),
    ],
    "bonheur": [
        ("eudaimonia", 3, "L'eudaimonia aristotélicienne est :", ["Un plaisir passager", "Le bonheur comme activité conforme à la vertu", "L'absence de désir", "Un droit politique"], 1, "Éthique à Nicomaque — bonheur = vie vertueuse active."),
        ("epicure", 2, "Pour Épicure, le bonheur est l'ataraxie, c'est-à-dire :", ["La richesse", "L'absence de trouble de l'âme", "La gloire", "La guerre"], 1, "Lettre à Ménécée — modération des désirs."),
        ("kant-bonheur", 3, "Kant oppose le bonheur et le devoir car :", ["Le bonheur est immoral", "Le devoir ne peut pas être fondé sur la recherche du bonheur", "Le bonheur n'existe pas", "Le devoir est hédoniste"], 1, "Fondement de la métaphysique des mœurs — morale autonome."),
        ("schopenhauer", 2, "Schopenhauer considère que la vie est :", ["Essentiellement heureuse", "Essentiellement souffrance", "Neutre", "Divine"], 1, "Le monde comme volonté et comme représentation."),
        ("stoiciens", 2, "Les stoïciens (Épictète) lient le bonheur à :", ["La fortune", "Le jugement sur les événements, non aux événements eux-mêmes", "La richesse", "Le pouvoir"], 1, "Le bonheur dépend de ce que nous contrôlons (nos jugements)."),
        ("bonheur-devoir", 2, "Peut-on sacrifier son bonheur pour le devoir selon Kant ?", ["Non, jamais", "Oui, le devoir prime sur le bonheur", "Le devoir n'existe pas", "Le bonheur est le devoir"], 1, "Agir par devoir, non par inclination."),
    ],
    "conscience": [
        ("cogito", 3, "Le cogito cartésien prouve :", ["L'existence du monde", "L'existence du sujet pensant", "L'existence de Dieu seule", "L'inexistence de l'âme"], 1, "Méditation II — douter de tout sauf de penser."),
        ("conscience-morale", 3, "La conscience morale kantienne révèle :", ["Les passions", "L'impératif catégorique en nous", "L'inconscient", "Le hasard"], 1, "La loi morale est rationnelle et universelle."),
        ("rousseau-conscience", 2, "Rousseau considère la conscience morale comme :", ["Artificielle", "Naturelle, corrompue par la société", "Inexistante", "Divine uniquement"], 1, "Émile — la conscience naturelle précède la société."),
        ("freud-conscience", 3, "Freud remet en cause la conscience en montrant :", ["Qu'elle est totale", "Que l'inconscient détermine une grande part de nos actes", "Qu'elle est divine", "Qu'elle est identique à la raison"], 1, "La conscience n'est pas maîtresse en sa maison."),
        ("sartre-conscience", 2, "Pour Sartre, la conscience est :", ["Une substance", "Toujours conscience de quelque chose et liberté", "Un automatisme", "Identique à l'inconscient"], 1, "L'être et le néant — conscience = liberté."),
        ("locke-identite", 2, "Locke fonde l'identité personnelle sur :", ["Le corps", "La continuité de la conscience", "Le nom", "La nationalité"], 1, "Essai sur l'entendement humain."),
    ],
    "devoir": [
        ("imperatif", 3, "L'impératif catégorique kantien commande d'agir :", ["Selon ses envies", "D'après une maxime universalisable", "Pour le plaisir", "Selon la tradition"], 1, "Agir uniquement d'après la maxime qui peut valoir loi universelle."),
        ("devoir-inclination", 3, "Agir par devoir (Kant), c'est agir :", ["Par plaisir", "Par respect de la loi morale, contre ses inclinations si nécessaire", "Par habitude", "Par peur"], 1, "La moralité exige l'autonomie de la volonté."),
        ("levinas", 2, "Levinas fonde le devoir sur :", ["Le contrat", "La responsabilité infinie envers autrui", "L'intérêt", "La force"], 1, "Éthique comme philosophie première."),
        ("desobeissance", 2, "La désobéissance civile (Thoreau, Arendt) consiste à :", ["Violer toute loi", "Refuser une loi injuste par un acte public conscient", "Fuir la société", "Obéir aveuglément"], 1, "Refus public et argumenté d'une loi jugée injuste."),
        ("devoir-universel", 2, "Le devoir est-il universel pour Kant ?", ["Non, relatif", "Oui, la loi morale vaut pour tout être rationnel", "Seulement en Europe", "Seulement pour les philosophes"], 1, "Moralité universelle et rationnelle."),
    ],
    "etat": [
        ("hobbes-etat", 3, "Hobbes justifie l'État (Léviathan) par :", ["La volonté divine seule", "La nécessité de mettre fin à l'état de nature", "Le bonheur", "L'art"], 1, "Sans État, guerre de tous contre tous."),
        ("locke-etat", 2, "Pour Locke, l'État a pour rôle de protéger :", ["Le monarque", "Les droits naturels (vie, liberté, propriété)", "L'église", "L'armée"], 1, "Second traité du gouvernement civil."),
        ("rousseau-souverainete", 3, "Pour Rousseau, la souveraineté appartient :", ["Au roi", "Au peuple (volonté générale)", "Aux riches", "À l'armée"], 1, "Contrat social — souveraineté populaire."),
        ("marx-etat", 2, "Marx considère l'État comme :", ["Éternel", "Un instrument de domination de classe destiné à disparaître", "Divin", "Neutre"], 1, "L'État avecers away dans la société communiste."),
        ("arendt-pouvoir", 2, "Arendt distingue pouvoir et violence :", ["Ce sont synonymes", "Le pouvoir naît de l'action collective ; la violence est instrumentale", "La violence est supérieure", "Le pouvoir n'existe pas"], 1, "Du fait agir — le pouvoir n'est pas la force."),
        ("legal-legitime-etat", 2, "Une loi peut être légale mais illégitime. Cela signifie :", ["C'est impossible", "Elle est conforme au droit positif mais moralement injuste", "Elle est toujours juste", "Elle n'est pas écrite"], 1, "Distinction fondamentale en philosophie du droit."),
    ],
    "inconscient": [
        ("freud-refoulement", 3, "Le refoulement freudien consiste à :", ["Oublier volontairement", "Exclure de la conscience des représentations inacceptables", "Renforcer la mémoire", "Dormir"], 1, "Mécanisme de défense de la pulsion."),
        ("schopenhauer-volonte", 2, "Schopenhauer identifie l'essence du monde à :", ["La raison", "La volonté aveugle", "Dieu", "Le hasard"], 1, "Le monde comme volonté et comme représentation."),
        ("sartre-inconscient", 2, "Sartre critique l'inconscient freudien car il :", ["Est trop scientifique", "Nie la responsabilité et la liberté du sujet", "Est trop clair", "N'existe pas du tout"], 1, "L'existentialisme refuse l'alibi de l'inconscient."),
        ("nietzsche-instincts", 2, "Nietzsche affirme que :", ["La conscience est tout", "Les instincts sont plus profonds que la conscience", "L'inconscient n'existe pas", "La raison domine tout"], 1, "La généalogie de la morale — critique de la conscience."),
        ("inconscient-liberte", 3, "L'inconscient menace-t-il la liberté ?", ["Non, jamais", "Oui, s'il détermine nos actes à notre insu", "L'inconscient n'existe pas", "La liberté n'existe pas"], 1, "Problème central : déterminisme psychique vs libre arbitre."),
    ],
    "justice": [
        ("platon-justice", 3, "Pour Platon, la justice est :", ["La force du plus fort", "L'harmonie de l'âme et de la Cité", "L'égalité absolue", "Le hasard"], 1, "République — chacun à sa place selon sa nature."),
        ("aristote-equite", 2, "L'équité (dikaiosynè) aristotélicienne est :", ["L'injustice", "La vertu de donner à chacun sa part", "L'égalité arithmétique stricte", "La vengeance"], 1, "Éthique à Nicomaque, livre V."),
        ("rawls-equite", 3, "Pour Rawls, la justice c'est l'équité, choisie :", ["Par le plus fort", "Derrière un voile d'ignorance", "Par tradition", "Par hasard"], 1, "Théorie de la justice (1971)."),
        ("nozick", 2, "Nozick défend une justice fondée sur :", ["L'égalité totale", "Le respect des droits de propriété légitimes", "La volonté générale", "Le bonheur"], 1, "Anarchie, État et utopie — libertarianisme."),
        ("loi-injuste", 3, "Une loi injuste est-elle une loi ? (question classique)", ["Oui, toujours", "Débat : le positivisme dit oui, le droit naturel dit non", "Non, jamais une loi", "Seulement si elle est ancienne"], 1, "Débat Hart/Kelsen vs droit naturel (Aquinas, Cicéron)."),
        ("egalite-equite", 2, "Égalité et équité se distinguent car :", ["Ce sont synonymes", "L'égalité traite tous pareil ; l'équité adapte au cas particulier", "L'équité est injuste", "L'égalité est toujours injuste"], 1, "Aristote : justice distributive et corrective."),
    ],
    "langage": [
        ("saussure", 3, "Saussure distingue langue et parole :", ["Ce sont synonymes", "Langue = système social ; parole = acte individuel", "Parole = grammaire ; langue = conversation", "Langue = oral ; parole = écrit"], 1, "Cours de linguistique générale (1916)."),
        ("wittgenstein-langage", 3, "Wittgenstein affirme que les limites du langage :", ["N'existent pas", "Sont les limites de notre monde", "Sont infinies", "Concernent seulement la poésie"], 1, "Tractatus — le langage structure la pensée."),
        ("signe-arbitraire", 2, "Le signe linguistique (Saussure) est arbitraire car :", ["Il est naturel", "Le lien signifiant/signifié est conventionnel", "Il est éternel", "Il est divin"], 1, "Pas de lien naturel entre le mot et la chose."),
        ("austin-parole", 2, "La « parole acte » (Austin) signifie que :", ["Parler ne fait rien", "On accomplit des actes en parlant (promettre, ordonner…)", "Le langage est muet", "Seul l'écrit compte"], 1, "Quand dire c'est faire (How to Do Things with Words)."),
        ("heidegger-langage", 2, "Heidegger dit que le langage est :", ["Un simple outil", "La demeure de l'être", "Une erreur", "Inférieur à la technique"], 1, "Lettre sur l'humanisme."),
        ("langage-pensee", 3, "Le langage détermine-t-il la pensée ?", ["Non, jamais", "Débat : il l'exprime ou la constitue (Wittgenstein, Saussure)", "Oui, totalement et sans débat", "La pensée n'existe pas"], 1, "Question centrale de la philosophie du langage."),
    ],
    "liberte": [
        ("liberte-negative", 3, "La liberté négative (Berlin) est :", ["L'autonomie morale", "L'absence d'entraves extérieures", "La soumission à la loi", "L'aliénation"], 1, "Two Concepts of Liberty (1958)."),
        ("spinoza-liberte", 2, "Pour Spinoza, la liberté est :", ["L'absence de causes", "La connaissance de la nécessité", "Le hasard", "La passion"], 1, "Éthique — servir Dieu/Nature par la raison."),
        ("sartre-liberte", 3, "« Condamné à être libre » signifie (Sartre) :", ["La liberté est un choix optionnel", "L'homme ne peut pas ne pas être libre et responsable", "La liberté est une illusion", "Seul Dieu est libre"], 1, "Pas d'essence humaine prédéfinie — existence précède essence."),
        ("determinisme", 3, "Le déterminisme affirme que :", ["Tout est libre", "Tout événement a une cause", "Rien n'a de cause", "Seul l'esprit cause"], 1, "Problème classique : déterminisme vs libre arbitre."),
        ("kant-liberte", 2, "Kant concilie liberté et déterminisme par :", ["Le rejet de la science", "La distinction phénomène/noumène", "Le hasard", "L'inconscient"], 1, "L'homme est libre en tant que noumène, déterminé en phénomène."),
        ("mill-liberte", 2, "Mill défend la liberté individuelle sauf si :", ["L'État l'ordonne", "Elle nuit à autrui", "Elle est religieuse", "Elle est économique"], 1, "De la liberté — harm principle."),
    ],
    "nature": [
        ("rousseau-nature", 3, "Rousseau affirme que l'homme naturel est :", ["Méchant", "Bon, corrompu par la société", "Indifférent", "Divin"], 1, "Discours sur l'origine de l'inégalité."),
        ("aristote-nature", 2, "La nature (physis) aristotélicienne agit :", ["Au hasard", "En vue d'une fin (téléologie)", "Sans loi", "Contre l'homme"], 1, "Physique et Métaphysique — finalisme."),
        ("descartes-nature", 2, "Descartes conçoit la nature comme :", ["Animée", "Mécanique, régie par des lois", "Divine uniquement", "Inexistante"], 1, "L'homme « maître et possesseur de la nature »."),
        ("heidegger-nature", 2, "Heidegger critique la technique moderne car elle :", ["Respecte la nature", "Réduit la nature à un stock exploitable (Gestell)", "Est trop faible", "N'existe pas"], 1, "La question de la technique."),
        ("nature-culture", 3, "L'homme est-il un animal comme les autres ?", ["Oui, identique", "Non, la raison et la culture le distinguent", "L'homme n'est pas animal", "Seule la culture existe"], 1, "Aristote : animal politique et rationnel."),
        ("etat-nature", 2, "L'état de nature (Hobbes, Locke, Rousseau) est :", ["Un fait historique prouvé", "Un concept hypothétique pour penser le contrat social", "Un mythe religieux", "L'état actuel"], 1, "Outil de la philosophie politique moderne."),
    ],
    "raison": [
        ("descartes-raison", 3, "Descartes fonde la certitude sur :", ["La tradition", "Le doute méthodique et la raison", "Les sens seuls", "L'autorité"], 1, "Discours de la méthode — raison naturelle à tous."),
        ("hume-raison", 3, "Hume affirme que la raison est esclave des passions. Cela signifie :", ["La raison domine tout", "Les passions motivent l'action ; la raison sert d'instrument", "Les passions n'existent pas", "La raison est inutile"], 1, "Traité de la nature humaine."),
        ("kant-antinomies", 2, "Kant montre que la raison :", ["Est illimitée", "Pose des questions insolubles (antinomies) quand elle outrepasse l'expérience", "N'existe pas", "Est identique à la foi"], 1, "Critique de la raison pure."),
        ("raison-instrumentale", 3, "La raison instrumentale (Horkheimer/Adorno) :", ["Est toujours émancipatrice", "Calcule les moyens sans questionner les fins", "N'existe pas", "Est religieuse"], 1, "Dialectique de la Raison — critique de la modernité."),
        ("pascal-raison", 2, "Pascal critique la raison en affirmant :", ["Qu'elle suffit à tout", "Que le cœur a ses raisons que la raison ignore", "Qu'elle n'existe pas", "Qu'elle est dangereuse uniquement"], 1, "Pensées — limites de la raison discursive."),
        ("raison-foi", 2, "Augustin propose :", ["Foi contre raison", "Credo ut intelligam (croire pour comprendre)", "Raison seule", "Rejet de la foi"], 1, "Foi et raison concordent."),
    ],
    "religion": [
        ("feuerbach", 2, "Feuerbach affirme que Dieu est :", ["Réel", "La projection de l'essence humaine", "Le diable", "La nature"], 1, "L'essence du christianisme (1841)."),
        ("kant-postulats", 2, "Kant postule Dieu, l'immortalité et la liberté comme :", ["Objets de science", "Conditions de la morale pratique", "Illusions", "Mythes inutiles"], 1, "Critique de la raison pratique — postulats de la raison pratique."),
        ("weber-desenchantement", 2, "Le « désenchantement du monde » (Weber) désigne :", ["La magie partout", "L'éloignement progressif du religieux par la rationalisation", "Le retour de la religion", "La fin de la science"], 1, "L'éthique protestante et l'esprit du capitalisme."),
        ("religion-morale", 3, "Kant montre que la morale peut-elle s'autonomiser de la religion ?", ["Non", "Oui, la morale rationnelle ne dépend pas de la religion", "La religion est obligatoire", "La morale n'existe pas"], 1, "Fondement de la métaphysique des mœurs."),
        ("liberte-conscience", 2, "La liberté de conscience implique :", ["L'obligation de croire", "Le droit de croire ou de ne pas croire", "L'interdiction de la religion", "Une seule religion"], 1, "Droit fondamental dans les démocraties laïques."),
        ("science-religion", 2, "La science et la religion :", ["Sont toujours identiques", "Peuvent entrer en tension ou coexister selon les positions", "Sont toujours incompatibles sans exception", "N'ont aucun rapport"], 1, "Débat historique (Galilée, évolution, etc.)."),
    ],
    "science": [
        ("popper", 3, "Pour Popper, une théorie scientifique doit être :", ["Indémontrable", "Réfutable", "Vraie à jamais", "Métaphysique"], 1, "Critère de falsifiabilité."),
        ("kuhn-paradigme", 2, "Kuhn parle de « révolutions scientifiques » car :", ["La science ne change jamais", "Les paradigmes dominants sont remplacés", "La science est fausse", "Les scientifiques sont des révolutionnaires politiques"], 1, "Structure des révolutions scientifiques."),
        ("bacon", 2, "Francis Bacon affirme « savoir est pouvoir ». Il valorise :", ["La scolastique", "La méthode expérimentale", "La métaphysique", "L'art seul"], 1, "Novum Organum — induction expérimentale."),
        ("comte-science", 2, "Le positivisme de Comte place la science :", ["Sous la religion", "Au sommet de la connaissance légitime", "Hors de la culture", "Dans l'art"], 1, "Hiérarchie : théologie, métaphysique, positivisme."),
        ("science-limites", 3, "La science explique-t-elle tout ?", ["Oui", "Non, elle ne répond pas aux questions de sens et de valeur", "La science n'existe pas", "Seule la religion explique"], 1, "Question classique au bac."),
        ("bachelard", 2, "Bachelard étudie les « obstacles épistémologiques » :", ["Les instruments", "Les préjugés qui freinent l'esprit scientifique", "Les laboratoires", "Les mathématiques"], 1, "Formation de l'esprit scientifique."),
    ],
    "technique": [
        ("heidegger-gestell", 3, "Le Gestell (Heidegger) désigne :", ["Un outil", "L'arrimage qui réduit le monde à ressource", "L'art", "La religion"], 1, "Enframing — essence de la technique moderne."),
        ("ellul", 2, "Jacques Ellul affirme que la technique :", ["Est neutre", "Suit sa propre logique autonome", "N'existe pas", "Est toujours bonne"], 1, "Le système technicien."),
        ("marx-forces", 2, "Marx lie technique et :", ["Art", "Forces productives et rapports sociaux", "Religion seule", "Hasard"], 1, "Le matérialisme historique."),
        ("technique-neutre", 3, "La technique est-elle neutre ?", ["Oui, toujours", "Débat : outil neutre vs porteur de valeurs", "Non, toujours mauvaise", "Elle n'existe pas"], 1, "Question centrale : responsabilité et choix."),
        ("jonas-responsabilite", 2, "Hans Jonas propose le « principe responsabilité » face :", ["À l'art", "Aux techniques destructrices pour les générations futures", "Au passé", "À la religion"], 1, "Éthique pour l'ère technologique."),
        ("arendt-vita", 2, "Arendt distingue travail, œuvre et action. La technique menace :", ["Rien", "La vita activa (vie active)", "La religion", "Les mathématiques"], 1, "Condition de l'homme moderne."),
    ],
    "temps": [
        ("augustin-temps", 3, "Augustin situe le temps :", ["Dans le corps seul", "Dans l'âme (mémoire, attention, attente)", "Hors de l'homme", "Dans l'espace"], 1, "Confessions XI — temps psychologique."),
        ("bergson-duree", 3, "La durée vécue (Bergson) :", ["Se réduit au chronomètre", "Est qualitative et irréductible au spatial", "N'existe pas", "Est identique au temps physique"], 1, "Essai sur les données immédiates de la conscience."),
        ("kant-temps", 2, "Pour Kant, le temps est :", ["Une chose en soi", "Une forme a priori de la sensibilité", "Une illusion", "Éternel dans les choses"], 1, "Critique de la raison pure."),
        ("heidegger-mort", 2, "Heidegger lie le temps existentiel à :", ["L'horloge", "L'être-pour-la-mort (finitude)", "L'éternité", "Le hasard"], 1, "Être et Temps — temporalité du Dasein."),
        ("cyclique-lineaire", 2, "Le temps cyclique s'oppose au temps linéaire car :", ["Ils sont identiques", "Cyclique = répétition ; linéaire = histoire orientée", "Le linéaire n'existe pas", "Le cyclique est moderne"], 1, "Repères historiques et cosmologiques."),
        ("temps-reel", 2, "Le temps est-il réel ou mental ?", ["Uniquement réel", "Débat : objectif (physique) vs condition de l'expérience (Kant, Bergson)", "Uniquement mental", "Il n'existe pas"], 1, "Question métaphysique classique."),
    ],
    "travail": [
        ("marx-alienation", 3, "L'aliénation du travail (Marx) signifie :", ["Le travailleur s'épanouit", "Le travailleur ne s'approprie pas le produit de son travail", "Le travail est loisir", "Le travail n'existe pas"], 1, "Manuscrits de 1844."),
        ("arendt-travail", 2, "Arendt distingue travail (nécessité), œuvre (fabrication) et action (politique). Le travail :", ["Est la plus noble activité", "Répond aux besoins biologiques", "N'existe pas", "Est identique à l'action"], 1, "Condition de l'homme moderne."),
        ("locke-travail", 2, "Locke fonde la propriété sur :", ["La naissance", "Le travail qui mélange l'homme à la chose", "La guerre", "Le hasard"], 1, "Second traité — travail et propriété."),
        ("aristote-loisir", 2, "Aristote oppose travail servile et :", ["Technique", "Loisir (skholè), activité libre supérieure", "Religion", "Guerre"], 1, "Politique — le loisir permet la philosophie."),
        ("travail-liberte", 3, "Le travail aliène-t-il l'homme ?", ["Jamais", "Sous le capitalisme oui (Marx) ; peut être émancipateur si non aliéné", "Toujours totalement", "Le travail n'existe pas"], 1, "Débat Marx / républicains du travail."),
        ("automatisation", 2, "L'automatisation du travail pose la question :", ["De la couleur", "De la fin du travail et de la liberté", "De la religion", "Du temps cyclique"], 1, "Enjeu contemporain lié à la technique."),
    ],
    "verite": [
        ("platon-verite", 3, "Pour Platon, la vérité est :", ["L'opinion", "L'Idée intelligible", "Le mensonge", "Le hasard"], 1, "Allégorie de la caverne — sortir des ombres."),
        ("descartes-verite", 2, "Descartes définit la vérité par :", ["L'autorité", "La clarté et la distinction des idées", "Le hasard", "Les sens seuls"], 1, "Critère de l'évidence rationnelle."),
        ("nietzsche-verite", 3, "Nietzsche affirme qu'il n'y a pas de faits mais des interprétations. Cela suggère :", ["L'absolutisme", "Un perspectivisme sur la vérité", "La science est fausse", "Platon avait raison"], 1, "Critique de la « vraie vie » platonicienne."),
        ("heidegger-aletheia", 2, "L'aletheia (Heidegger) signifie :", ["Le mensonge", "Le dévoilement de l'être", "L'opinion", "Le calcul"], 1, "Vérité comme événement d'apparition."),
        ("correspondance", 2, "La théorie de la correspondance définit la vérité comme :", ["Cohérence interne", "Adéquation entre proposition et réalité", "Utilité", "Croyance"], 1, "Adaequatio rei et intellectus."),
        ("relativisme", 3, "Le relativisme affirme que la vérité :", ["Est une et universelle", "Dépend du contexte ou de la perspective", "N'existe pas du tout", "Est toujours scientifique"], 1, "Opposé à l'absolutisme platonicien."),
    ],
}


def build_learning_cards():
    cards = list(LEARNING_CARDS_GLOBAL)
    card_id = len(cards)

    for notion_id, ped in NOTION_PEDAGOGIE.items():
        for text, author, source, usage in ped.get("citations", []):
            card_id += 1
            cards.append({
                "id": f"learn-{notion_id}-{card_id}",
                "theme": notion_id,
                "front": f"« {text} »",
                "back": f"{author} — {source}. {usage.capitalize()}.",
                "importance": 2,
            })
        for item in ped.get("retenir", [])[:2]:
            card_id += 1
            cards.append({
                "id": f"learn-{notion_id}-memo-{card_id}",
                "theme": notion_id,
                "front": f"Notion « {notion_id} » — qu'est-ce qu'il faut retenir ?",
                "back": item,
                "importance": 2,
            })

    return cards


def enrich_explanation(base, pour_aller_plus_loin=""):
    text = base
    if pour_aller_plus_loin:
        text += f"<br><br><strong>Pour aller plus loin :</strong> {pour_aller_plus_loin}"
    return text


def build_questions():
    questions = []

    def add(theme, suffix, importance, prompt, choices, correct, explanation,
            hint="", level="consolidation", pour_aller_plus_loin=""):
        q = {
            "id": f"{theme}-{suffix}",
            "theme": theme,
            "importance": importance,
            "level": level,
            "prompt": prompt,
            "choices": choices,
            "correct": correct,
            "explanation": enrich_explanation(explanation, pour_aller_plus_loin=pour_aller_plus_loin),
        }
        if hint:
            q["hint"] = hint
        if level:
            q["level"] = level
        questions.append(q)

    for suffix, imp, prompt, choices, correct, expl in METHODOLOGIE:
        add("methodologie", suffix, imp, prompt, choices, correct, expl, level="decouverte")

    for suffix, imp, quote, author, choices, correct, expl in CITATIONS:
        prompt = f"À qui attribue-t-on : {quote} ?"
        hint = f"Pensez à la notion principale associée à {author}."
        add("citations", suffix, imp, prompt, choices, correct, expl,
            hint=hint, level="consolidation",
            pour_aller_plus_loin=f"Retrouvez le contexte de cette citation dans la fiche cours.")

    for suffix, imp, prompt, choices, correct, expl in REPERES:
        add("reperes", suffix, imp, prompt, choices, correct, expl, level="decouverte")

    for notion_id, _, _ in NOTIONS:
        for suffix, imp, prompt, choices, correct, expl in NOTION_QUESTIONS.get(notion_id, []):
            hint = ""
            palp = ""
            if notion_id in NOTION_PEDAGOGIE:
                ped = NOTION_PEDAGOGIE[notion_id]
                if ped.get("retenir"):
                    hint = f"Rappel : {ped['retenir'][0]}"
            add(notion_id, suffix, imp, prompt, choices, correct, expl,
                hint=hint, level="consolidation", pour_aller_plus_loin=palp)

    # Questions de catégorisation — entraînent l'encodage mémoriel par familles d'idées
    CATEGORISATION = [
        ("perspectives-existence", 2,
         "Quelles notions appartiennent à « L'existence humaine et la culture » ?",
         ["Art, bonheur, technique", "Devoir, État, justice", "Raison, science, vérité", "Liberté seule"], 0,
         "Art, bonheur, conscience, inconscient, nature, religion, technique, temps, travail."),
        ("perspectives-morale", 2,
         "Quelles notions appartiennent à « La morale et la politique » ?",
         ["Langage et science", "Devoir, État, justice, liberté", "Art et religion", "Temps et travail"], 1,
         "Devoir, État, justice et liberté structurent cette perspective."),
        ("perspectives-connaissance", 2,
         "Quelles notions appartiennent à « La connaissance » ?",
         ["Langage, raison, science, vérité", "Bonheur et nature", "État et devoir", "Art et technique"], 0,
         "Les quatre notions de la connaissance : langage, raison, science, vérité."),
    ]
    for suffix, imp, prompt, choices, correct, expl in CATEGORISATION:
        add("reperes", suffix, imp, prompt, choices, correct, expl,
            hint="Classez mentalement les 17 notions en trois familles avant de répondre.",
            level="decouverte")

    # Questions « développement » — guident au-delà du descriptif
    DEVELOPPEMENT = [
        ("liberte-developper", "liberte", 3,
         "Pourquoi Sartre dit-il que l'homme est « condamné » à être libre ?",
         ["Parce que la liberté est un châtiment divin", "Parce qu'il ne peut pas échapper à la responsabilité de ses choix", "Parce que la liberté n'existe pas", "Parce que l'État l'oblige"], 1,
         "Sans essence prédéfinie, l'homme doit choisir et assumer — il ne peut pas se dérober à cette responsabilité.",
         "Pensez à la formule « l'existence précède l'essence ».",
         "examen",
         "Mobilisez cette idée en Partie II d'un sujet sur la liberté."),
        ("kant-developper", "devoir", 3,
         "Que signifie « agir par devoir » chez Kant ?",
         ["Suivre ses envies", "Agir par respect de la loi morale, même contre ses inclinations", "Obéir à l'État", "Maximiser le plaisir"], 1,
         "La moralité authentique obéit à la raison pratique, non au penchant.",
         "Relisez l'impératif catégorique.",
         "examen",
         "Distinguez agir par devoir vs agir conformément au devoir par inclination."),
        ("platon-developper", "verite", 3,
         "Que montre l'allégorie de la caverne ?",
         ["Que la science est inutile", "La distinction entre apparences (ombres) et réalité intelligible (Idées)", "Que l'art est supérieur à la philosophie", "Que le bonheur est impossible"], 1,
         "Les prisonniers prennent les ombres pour la réalité ; le philosophe accède au soleil des Idées.",
         "Qui est libéré dans l'allégorie ?",
         "examen",
         "Utilisez cette image pour parler de vérité et d'ignorance."),
    ]
    for suffix, theme, imp, prompt, choices, correct, expl, hint, level, palp in DEVELOPPEMENT:
        add(theme, suffix, imp, prompt, choices, correct, expl, hint=hint, level=level, pour_aller_plus_loin=palp)

    return questions


def build_themes():
    themes = []
    for tid, label, icon, perspective in EXTRA_THEMES:
        themes.append({
            "id": tid,
            "label": label,
            "icon": icon,
            "perspective": perspective,
        })
    for nid, label, perspective in NOTIONS:
        themes.append({
            "id": nid,
            "label": label,
            "icon": "menu_book",
            "perspective": perspective,
        })
    return themes


def main():
    data = {
        "id": "philo",
        "label": "Philosophie",
        "description": "Parcours progressif : cartes d'apprentissage, QCM guidés (indices et explications détaillées), citations et notions essentielles pour le bac.",
        "icon": "psychology",
        "perspectives": PERSPECTIVES,
        "pedagogie": NEUROPSY_PROFILE,
        "themes": build_themes(),
        "learningCards": build_learning_cards(),
        "questions": build_questions(),
    }
    out = Path(__file__).resolve().parent.parent / "data" / "exercices-philo.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Written {len(data['questions'])} questions to {out}")


if __name__ == "__main__":
    main()
