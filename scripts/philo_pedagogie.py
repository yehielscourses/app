#!/usr/bin/env python3
"""Contenu pédagogique enrichi pour la philosophie — adapté au profil neuropsy."""

# Profil d'apprentissage dérivé du bilan neuropsychologique (WAIS-IV, CVLT, attention…)
NEUROPSY_PROFILE = {
    "label": "Parcours adapté",
    "forces": [
        "Raisonnement logique et structuration (plans dialectiques, tableaux, schémas)",
        "Analyse de problèmes nouveaux et déduction de règles",
        "Planification quand le cadre est clair et rappelé",
    ],
    "adaptations": [
        "Contenus organisés par catégories explicites (facilite l'encodage en mémoire)",
        "Pas de chronomètre : la précision prime sur la vitesse",
        "Développements guidés : on passe du descriptif à l'abstraction pas à pas",
        "Rappels et fiches « à retenir » avant les exercices",
        "Révisions espacées : mode Apprendre puis QCM",
    ],
    "conseil": (
        "Avant chaque série d'exercices, lisez la fiche cours correspondante et parcourez "
        "les cartes « À retenir ». Prenez le temps de reformuler avec vos mots."
    ),
}

PERSPECTIVES = [
    {"id": "existence", "label": "L'existence humaine et la culture"},
    {"id": "morale", "label": "La morale et la politique"},
    {"id": "connaissance", "label": "La connaissance"},
]


def section(title, body):
    return f'<section class="fiche-section"><h3>{title}</h3>{body}</section>'


def pedago_box(title, body, variant="guide"):
    return (
        f'<aside class="fiche-pedago fiche-pedago--{variant}">'
        f'<h4 class="fiche-pedago-title">{title}</h4>{body}</aside>'
    )


def quote(text, author, source=""):
    cite = f"— {author}"
    if source:
        cite += f", <em>{source}</em>"
    return f'<blockquote class="fiche-quote"><p>« {text} »</p><cite>{cite}</cite></blockquote>'


def citation_card(text, author, source, usage, notion=""):
    return (
        f'<div class="fiche-citation-card">'
        f'<p class="fiche-citation-text">« {text} »</p>'
        f'<p class="fiche-citation-meta"><strong>{author}</strong>'
        f'{f" — {source}" if source else ""}</p>'
        f'<p class="fiche-citation-usage"><strong>À utiliser quand :</strong> {usage}</p>'
        f'</div>'
    )


def auteur_card(name, epoque, these, usage, exemple=""):
    ex = f'<p class="fiche-auteur-exemple"><strong>Exemple en dissertation :</strong> {exemple}</p>' if exemple else ""
    return (
        f'<div class="fiche-auteur-card">'
        f'<h4 class="fiche-auteur-name">{name} <span class="fiche-auteur-epoque">({epoque})</span></h4>'
        f'<p class="fiche-auteur-these"><strong>Thèse :</strong> {these}</p>'
        f'<p class="fiche-auteur-usage"><strong>En bac :</strong> {usage}</p>'
        f'{ex}</div>'
    )


def list_items(items):
    return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def category_table(rows):
    """Tableau par catégories — aide l'encodage mémoriel."""
    body = '<table class="fiche-category-table"><thead><tr><th>Catégorie</th><th>Éléments clés</th><th>Repère</th></tr></thead><tbody>'
    for cat, elements, repere in rows:
        body += f"<tr><td><strong>{cat}</strong></td><td>{elements}</td><td>{repere}</td></tr>"
    body += "</tbody></table>"
    return body


def plan_detaille(sujet, parties):
    html = f'<div class="fiche-plan-guide"><p class="fiche-plan-sujet"><strong>Sujet type :</strong> {sujet}</p>'
    for num, titre, idees, auteurs in parties:
        html += (
            f'<div class="fiche-plan-partie">'
            f'<h4>Partie {num} — {titre}</h4>'
            f'<p><strong>Idées à développer :</strong> {idees}</p>'
            f'<p><strong>Auteurs à mobiliser :</strong> {auteurs}</p>'
            f'</div>'
        )
    html += "</div>"
    return html


def checklist(items):
    return '<ul class="fiche-checklist">' + "".join(f'<li>{i}</li>' for i in items) + "</ul>"


# Données enrichies par notion
NOTION_PEDAGOGIE = {
    "art": {
        "intro": (
            "<p>L'art n'est pas seulement « joli » ou « décoratif ». En philosophie, il pose une question centrale : "
            "que fait l'artiste ? Copie-t-il le réel, le transforme-t-il, ou nous révèle-t-il quelque chose que la science "
            "ne voit pas ? Cette notion relie esthétique, vérité et culture.</p>"
            "<p><strong>Pour bien démarrer :</strong> demandez-vous toujours si l'œuvre <em>imite</em>, <em>exprime</em> "
            "ou <em>révèle</em>. Ces trois verbes structurent presque tous les sujets de bac.</p>"
        ),
        "categories": [
            ("Imitation", "Mimesis platonicienne, catharsis aristotélicienne", "L'art copie ou représente"),
            ("Création", "Art pour l'art, expression romantique, transfiguration", "L'art dépasse la copie"),
            ("Vérité", "Heidegger, aletheia, art engagé (Adorno)", "L'art ouvre un monde"),
        ],
        "auteurs": [
            ("Platon", "IVe s. av. J.-C.",
             "L'art imite les apparences, donc s'éloigne de la vérité des Idées ; le poète est exclu de la Cité.",
             "Partie I d'une dissertation sur l'imitation ; critique de l'illusion artistique.",
             "Sur « L'art n'est-il qu'une imitation ? », I : la mimesis semble définir l'art (théâtre = copie de la vie)."),
            ("Aristote", "IVe s. av. J.-C.",
             "La tragédie imite une action humaine et purifie les passions (catharsis) ; l'art aide à comprendre.",
             "Nuancer Platon : l'imitation n'est pas que mensonge, elle instruit.",
             "II : l'art ne copie pas bêtement, il organise l'action et suscite une expérience morale."),
            ("Kant", "XVIIIe s.",
             "Le jugement de goût est désintéressé ; le beau naît d'un accord libre entre entendement et imagination.",
             "Questions sur le beau objectif/subjectif, l'autonomie de l'art.",
             "Sur le beau : le goût n'est pas une question de profit, mais de forme harmonieuse perçue librement."),
            ("Heidegger", "XXe s.",
             "L'œuvre d'art ouvre un monde et fait advenir la vérité (aletheia).",
             "Partie III : l'art comme révélation, pas simple copie.",
             "III : Van Gogh et les souliers — l'œuvre révèle le monde d'un paysan, pas une copie de souliers."),
        ],
        "citations": [
            ("L'art est l'activité qui permet à la vérité de prendre son essor.", "Heidegger",
             "L'Origine de l'œuvre d'art",
             "défendre que l'art accède à une vérité que la science ne donne pas"),
            ("La poésie est plus philosophique que l'histoire.", "Aristote", "Poétique",
             "montrer que l'art universalise l'expérience humaine"),
        ],
        "retenir": [
            "Mimesis = imitation (Platon la critique, Aristote la valorise)",
            "Catharsis = purification des passions par la tragédie",
            "Art pour l'art = l'œuvre vaut par elle-même",
            "Heidegger : l'art ouvre un monde (vérité)",
        ],
        "reflexion": [
            "Peux-tu expliquer la différence entre imiter et créer, avec un exemple d'œuvre ?",
            "Pourquoi Platon exclut-il les poètes de sa Cité idéale ?",
            "En quoi l'art contemporain (ready-made) remet-il en cause l'imitation ?",
        ],
    },
    "bonheur": {
        "intro": (
            "<p>Tout le monde veut être heureux — mais « bonheur » ne veut pas dire la même chose pour Aristote, "
            "Épicure ou Kant. En terminale, il faut distinguer <em>plaisir</em>, <em>vertu</em>, <em>sagesse</em> "
            "et <em>devoir</em>.</p>"
            "<p><strong>Piège fréquent :</strong> confondre bonheur = plaisir immédiat. Les philosophes parlent souvent "
            "d'une <em>vie bonne</em> sur le long terme.</p>"
        ),
        "categories": [
            ("Hédonisme", "Épicure, ataraxie, modération des désirs", "Bonheur = absence de trouble"),
            ("Vertu", "Aristote, eudaimonia, activité conforme à la vertu", "Bonheur = excellence morale"),
            ("Devoir", "Kant, stoïciens, sacrifice du bonheur", "Le devoir peut primer"),
        ],
        "auteurs": [
            ("Aristote", "IVe s. av. J.-C.",
             "Le bonheur (eudaimonia) est la fin suprême de l'action humaine ; il exige vertu et vie active.",
             "Sujets « Le bonheur est-il le but de la vie ? » — Partie I.",
             "I : tout homme aspire au bien suprême ; pour Aristote, c'est une vie vertueuse et active."),
            ("Épicure", "IIIe s. av. J.-C.",
             "Le bonheur est l'ataraxie : absence de trouble obtenue par la modération des désirs.",
             "Nuancer l'hédonisme : ce n'est pas la débauche, mais la sobriété.",
             "I : on croit Épicure hédoniste ; en réalité il enseigne la modération."),
            ("Kant", "XVIIIe s.",
             "Le bonheur ne peut fonder la morale ; agir par devoir prime sur la quête du plaisir.",
             "Partie II : le bonheur n'épuise pas l'existence morale.",
             "II : un acte moral vaut par le devoir, non par le plaisir qu'il procure."),
            ("Schopenhauer", "XIXe s.",
             "La vie est souffrance ; le bonheur n'est qu'une pause dans la douleur.",
             "Partie II pessimiste ; le bonheur comme illusion.",
             "II : le bonheur n'est pas l'état normal de l'existence."),
        ],
        "citations": [
            ("Le bonheur est l'activité de l'âme conforme à la vertu.", "Aristote", "Éthique à Nicomaque",
             "définir le bonheur comme excellence et non comme plaisir"),
            ("Mieux vaut être Socrate insatisfait qu'un imbécile satisfait.", "Mill", "Utilitarisme",
             "distinguer qualité et quantité des plaisirs"),
        ],
        "retenir": [
            "Eudaimonia ≠ plaisir passager (Aristote)",
            "Ataraxie = tranquillité de l'âme (Épicure)",
            "Kant : devoir ≠ bonheur",
            "Stoïciens : bonheur = jugement sur les événements",
        ],
        "reflexion": [
            "Peux-tu donner un exemple où le devoir s'oppose au bonheur ?",
            "En quoi Épicure n'est pas un hédoniste au sens vulgaire ?",
        ],
    },
    "conscience": {
        "intro": (
            "<p>« Conscience » est un mot à plusieurs visages : conscience de soi (je pense), conscience morale "
            "(le remords), conscience éveillée (par opposition au sommeil). La question du bac : la conscience "
            "fait-elle la grandeur de l'homme, ou une partie de nous lui échappe-t-elle (inconscient) ?</p>"
        ),
        "categories": [
            ("Conscience de soi", "Cogito cartésien, identité (Locke)", "Je pense, donc je suis"),
            ("Conscience morale", "Rousseau, Kant, impératif catégorique", "La voix du devoir"),
            ("Limites", "Freud, Marx, inconscient", "La conscience n'est pas toute-puissante"),
        ],
        "auteurs": [
            ("Descartes", "XVIIe s.",
             "La conscience de penser est indubitable : le cogito fonde la certitude de l'existence du sujet.",
             "Partie I : la conscience comme dignité et certitude.",
             "I : même en doutant de tout, je ne peux douter que je pense."),
            ("Kant", "XVIIIe s.",
             "La conscience morale révèle en nous la loi universelle (impératif catégorique).",
             "Lien conscience / devoir / liberté.",
             "I : la conscience morale témoigne de notre capacité à l'autonomie."),
            ("Freud", "XXe s.",
             "L'inconscient détermine une grande part de nos actes ; la conscience n'est pas maîtresse en sa maison.",
             "Partie II : limites de la conscience.",
             "II : rêves, lapsus et névroses montrent une vie psychique hors conscience."),
            ("Sartre", "XXe s.",
             "La conscience est toujours conscience de quelque chose ; elle est liberté et responsabilité.",
             "Réponse à Freud : pas d'alibi inconscient pour fuir la responsabilité.",
             "III : même limitée, la conscience est responsabilité."),
        ],
        "citations": [
            ("Je pense, donc je suis.", "Descartes", "Méditations métaphysiques",
             "fonder la certitude sur la conscience de soi"),
            ("La conscience n'est pas maîtresse en sa maison.", "Freud", "1917",
             "introduire l'inconscient en Partie II"),
        ],
        "retenir": [
            "Cogito = conscience de soi comme certitude (Descartes)",
            "Conscience morale = loi en moi (Kant)",
            "Freud : inconscient vs conscience",
            "Sartre : conscience = liberté",
        ],
        "reflexion": [
            "Quelle différence entre conscience de soi et conscience morale ?",
            "L'inconscient détruit-il la responsabilité morale ?",
        ],
    },
    "devoir": {
        "intro": (
            "<p>Le devoir est ce qu'il faut faire même quand on n'en a pas envie. D'où vient-il ? De la raison (Kant), "
            "de la tradition, du contrat social ou de la rencontre avec autrui (Levinas) ? C'est une notion clé pour "
            "relier morale et liberté.</p>"
        ),
        "categories": [
            ("Obligation rationnelle", "Impératif catégorique, universalisabilité", "Kant"),
            ("Obligation sociale", "Contrat, institutions, Hegel", "Le devoir s'incarne dans les lois"),
            ("Responsabilité", "Levinas, désobéissance civile", "Devoir envers autrui"),
        ],
        "auteurs": [
            ("Kant", "XVIIIe s.",
             "Agir par devoir, c'est agir par respect de la loi morale universelle, indépendamment des inclinations.",
             "Notion centrale — impératif catégorique.",
             "I : le devoir ne dépend pas du plaisir mais de la raison pratique."),
            ("Mill", "XIXe s.",
             "Le devoir peut se justifier par ses conséquences sur le bonheur général (utilitarisme).",
             "Alternative conséquentialiste à Kant.",
             "II : le devoir sert le bien commun, pas seulement la forme de la loi."),
            ("Levinas", "XXe s.",
             "Le devoir envers autrui précède toute loi ; la responsabilité est infinie.",
             "Partie III : éthique de la rencontre.",
             "III : le visage d'autrui m'oblige avant tout contrat."),
        ],
        "citations": [
            ("Agis uniquement d'après la maxime qui peut valoir loi universelle.", "Kant", "Fondement de la métaphysique des mœurs",
             "formuler l'impératif catégorique"),
            ("Agis de telle sorte que tu traites l'humanité toujours comme une fin, jamais comme un moyen.", "Kant", "idem",
             "critiquer l'utilisation instrumentale des personnes"),
        ],
        "retenir": [
            "Devoir ≠ contrainte physique",
            "Impératif catégorique = loi universelle (Kant)",
            "Désobéissance civile = refus d'une loi injuste",
            "Levinas : responsabilité infinie",
        ],
        "reflexion": [
            "Peut-on vouloir son devoir (Kant) ?",
            "Faut-il obéir à une loi injuste ?",
        ],
    },
    "etat": {
        "intro": (
            "<p>Pourquoi acceptons-nous d'être gouvernés ? L'État impose des lois et use de la force. Est-ce un mal "
            "nécessaire (Hobbes) ou la condition de notre liberté (Rousseau) ? Cette notion structure toute la "
            "philosophie politique au bac.</p>"
        ),
        "categories": [
            ("État de nature", "Hobbes, Locke, Rousseau", "Hypothèse pour penser le contrat"),
            ("Souveraineté", "Volonté générale, légitimité", "Qui doit gouverner ?"),
            ("Limites", "Droits naturels, désobéissance, Marx", "L'État peut-il tout faire ?"),
        ],
        "auteurs": [
            ("Hobbes", "XVIIe s.",
             "Sans État, c'est la guerre de tous contre tous ; le Léviathan garantit la paix par la soumission.",
             "Partie I : l'État comme nécessité.",
             "I : l'état de nature est insupportable ; l'obéissance achète la sécurité."),
            ("Rousseau", "XVIIIe s.",
             "La souveraineté appartient au peuple ; la volonté générale fonde la légitimité politique.",
             "Partie III : l'État comme liberté collective.",
             "III : obéir à la volonté générale, c'est obéir à soi-même."),
            ("Marx", "XIXe s.",
             "L'État est un instrument de domination de classe ; il doit disparaître.",
             "Critique de l'État bourgeois.",
             "II : l'État masque des rapports de domination économique."),
        ],
        "citations": [
            ("L'homme est un loup pour l'homme.", "Hobbes", "De cive",
             "justifier la nécessité de l'État"),
            ("L'homme naît libre, et partout il est dans les fers.", "Rousseau", "Contrat social",
             "critiquer les chaînes sociales"),
        ],
        "retenir": [
            "État de nature = concept hypothétique, pas un fait historique",
            "Volonté générale (Rousseau)",
            "Légal ≠ légitime",
            "Marx : État = domination de classe",
        ],
        "reflexion": [
            "L'État garantit-il la liberté ou la restreint-il ?",
            "Peut-on vivre sans État ?",
        ],
    },
    "inconscient": {
        "intro": (
            "<p>Une part de nous échapperait à la conscience : désirs refoulés, pulsions, automatismes. L'inconscient "
            "menace-t-il la liberté ? Ou révèle-t-il une vérité plus profonde sur l'homme ? Notion en lien direct "
            "avec la conscience et la liberté.</p>"
        ),
        "categories": [
            ("Freudien", "Refoulement, pulsions, psychanalyse", "Découverte de l'inconscient"),
            ("Philosophique", "Schopenhauer, Nietzsche, volonté", "Ce qui nous anime sans nous"),
            ("Critiques", "Sartre, responsabilité", "L'inconscient comme alibi ?"),
        ],
        "auteurs": [
            ("Freud", "XXe s.",
             "L'inconscient détermine nos actes ; la psychanalyse vise à le rendre conscient.",
             "Partie I : déterminisme psychique.",
             "I : rêves et lapsus trahissent des désirs refoulés."),
            ("Schopenhauer", "XIXe s.",
             "La volonté aveugle gouverne notre vie ; la conscience n'en est que la surface.",
             "Préfiguration de l'inconscient.",
             "I : nous croyons choisir, mais la volonté nous pousse."),
            ("Sartre", "XXe s.",
             "L'inconscient freudien nie la responsabilité ; l'homme est condamné à être libre.",
             "Partie II-III : réhabiliter la liberté.",
             "III : invoquer l'inconscient, c'est fuir sa responsabilité."),
        ],
        "citations": [
            ("La conscience n'est pas maîtresse en sa maison.", "Freud", "1917",
             "argument central en Partie I"),
        ],
        "retenir": [
            "Refoulement = exclusion de la conscience (Freud)",
            "Inconscient ≠ sommeil",
            "Débat : liberté vs déterminisme psychique",
            "Sartre refuse l'alibi de l'inconscient",
        ],
        "reflexion": [
            "Un lapsus peut-il révéler l'inconscient ?",
            "Sommes-nous responsables de ce qui nous échappe ?",
        ],
    },
    "justice": {
        "intro": (
            "<p>Donner à chacun ce qui lui est dû — mais comment savoir ce qui est dû ? Égalité stricte, équité, "
            "mérite, droits fondamentaux : la justice est au cœur de la morale et de la politique.</p>"
        ),
        "categories": [
            ("Classique", "Platon, Aristote, harmonie", "Chacun à sa place"),
            ("Moderne", "Contrat social, droits, Rawls", "Justice comme équité"),
            ("Contemporaine", "Nozick, liberté, propriété", "Justice et droits individuels"),
        ],
        "auteurs": [
            ("Platon", "IVe s. av. J.-C.",
             "La justice est l'harmonie de l'âme et de la Cité ; chacun exerce la fonction qui lui convient.",
             "Définition classique.",
             "I : justice = ordre harmonieux."),
            ("Rawls", "XXe s.",
             "Les principes de justice sont ceux que choisiraient des individus derrière un « voile d'ignorance ».",
             "Justice contemporaine — équité.",
             "II : choisir sans connaître sa place sociale conduit à l'équité."),
            ("Nozick", "XXe s.",
             "La justice consiste à respecter les droits de propriété acquis légitimement.",
             "Critique de Rawls — libertarianisme.",
             "II : la redistribution forcée peut être injuste."),
        ],
        "citations": [
            ("La justice, c'est donner à chacun ce qui lui revient.", "Platon", "République",
             "définition canonique"),
        ],
        "retenir": [
            "Justice distributive vs corrective",
            "Égalité ≠ équité (Aristote)",
            "Voile d'ignorance (Rawls)",
            "Loi injuste : débat positivisme / droit naturel",
        ],
        "reflexion": [
            "Une loi injuste est-elle une loi ?",
            "La justice exige-t-elle l'égalité absolue ?",
        ],
    },
    "langage": {
        "intro": (
            "<p>Le langage nous permet de communiquer — mais fait-il plus ? Exprime-t-il une pensée préexistante, "
            "ou la constitue-t-il ? Cette notion relie connaissance, vérité et humanité.</p>"
        ),
        "categories": [
            ("Expression", "Descartes, langage = signe de raison", "Le langage traduit la pensée"),
            ("Structure", "Saussure, signe arbitraire", "Le sens naît du système"),
            ("Limites", "Wittgenstein, Heidegger", "Les limites du langage"),
        ],
        "auteurs": [
            ("Saussure", "XXe s.",
             "La langue est un système de signes arbitraires ; le sens naît des différences.",
             "Distinction langue/parole.",
             "II : on ne choisit pas librement sa langue, elle nous précède."),
            ("Wittgenstein", "XXe s.",
             "Les limites de mon langage sont les limites de mon monde.",
             "Partie II : le langage structure la pensée.",
             "II : ce dont on ne peut parler, il faut le taire."),
            ("Austin", "XXe s.",
             "On fait des choses en parlant : promettre, ordonner (parole-acte).",
             "Langage et action.",
             "III : parler, c'est aussi agir."),
        ],
        "citations": [
            ("Les limites de mon langage sont les limites de mon monde.", "Wittgenstein", "Tractatus",
             "langage constitue la pensée"),
        ],
        "retenir": [
            "Langue (système) vs parole (acte)",
            "Signe arbitraire (Saussure)",
            "Parole-acte (Austin)",
            "L'homme = animal doué de langage (Aristote)",
        ],
        "reflexion": [
            "Peut-on penser sans langage ?",
            "Le langage peut-il mentir ?",
        ],
    },
    "liberte": {
        "intro": (
            "<p>La liberté est une valeur universelle — mais que signifie-t-elle ? Absence de contrainte ? "
            "Autonomie de la volonté ? Sommes-nous libres ou déterminés par la nature, la société, l'inconscient ?</p>"
        ),
        "categories": [
            ("Liberté négative", "Absence d'entraves (Berlin)", "Ne pas être empêché"),
            ("Liberté positive", "Autonomie, autodétermination", "Être auteur de ses choix"),
            ("Déterminisme", "Causes naturelles, sociales, inconscient", "La liberté est-elle une illusion ?"),
        ],
        "auteurs": [
            ("Sartre", "XXe s.",
             "L'homme est condamné à être libre ; pas d'essence prédéfinie, responsabilité totale.",
             "Existentialisme — liberté radicale.",
             "II : l'expérience du choix est indubitable."),
            ("Spinoza", "XVIIe s.",
             "La liberté est la connaissance de la nécessité ; agir par la raison.",
             "Liberté compatible avec le déterminisme.",
             "III : être libre, c'est comprendre les causes qui nous déterminent."),
            ("Kant", "XVIIIe s.",
             "L'homme est libre en tant qu'être rationnel, soumis à la loi morale.",
             "Liberté pratique.",
             "III : la liberté morale fonde le devoir."),
        ],
        "citations": [
            ("L'homme est condamné à être libre.", "Sartre", "L'existentialisme est un humanisme",
             "défendre la liberté existentielle"),
        ],
        "retenir": [
            "Liberté négative vs positive (Berlin)",
            "Libre arbitre vs déterminisme",
            "Sartre : existence précède essence",
            "Spinoza : liberté = connaissance de la nécessité",
        ],
        "reflexion": [
            "Sommes-nous libres de nos désirs ?",
            "La liberté a-t-elle des limites ?",
        ],
    },
    "nature": {
        "intro": (
            "<p>L'homme appartient-il à la nature ou s'en distingue-t-il par la culture, la raison et la technique ? "
            "Cette notion traverse écologie, politique et anthropologie.</p>"
        ),
        "categories": [
            ("Nature humaine", "État de nature, instincts", "L'inné"),
            ("Culture", "Société, raison, langage", "L'acquis"),
            ("Rapport à la nature", "Domination, respect, écologie", "Que faire de la nature ?"),
        ],
        "auteurs": [
            ("Rousseau", "XVIIIe s.",
             "L'homme naturel est bon ; la société le corrompt.",
             "Partie I : le naturel comme origine.",
             "I : avant la société, l'homme était innocent."),
            ("Aristote", "IVe s. av. J.-C.",
             "L'homme est un animal politique ; la nature agit en vue d'une fin (téléologie).",
             "L'homme naturellement social.",
             "III : l'homme réalise sa nature en vivant en cité."),
            ("Heidegger", "XXe s.",
             "La technique moderne réduit la nature à un stock exploitable (Gestell).",
             "Écologie philosophique.",
             "II : la modernité dénature la nature."),
        ],
        "citations": [
            ("L'homme naît libre, et partout il est dans les fers.", "Rousseau", "Contrat social",
             "lien nature/corruption sociale"),
        ],
        "retenir": [
            "Physis = nature (ce qui croît)",
            "Nature / culture",
            "État de nature = hypothèse",
            "L'homme = animal politique (Aristote)",
        ],
        "reflexion": [
            "Existe-t-il une nature humaine universelle ?",
            "La culture dénature-t-elle l'homme ?",
        ],
    },
    "raison": {
        "intro": (
            "<p>La raison est notre capacité à penser selon des principes universels. Fonde-t-elle la science, "
            "la morale et la politique ? A-t-elle des limites (passions, foi, inconscient) ?</p>"
        ),
        "categories": [
            ("Raison théorique", "Science, démonstration, Descartes", "Connaître le vrai"),
            ("Raison pratique", "Devoir, Kant, morale", "Déterminer le bien"),
            ("Limites", "Hume, Pascal, passions", "La raison ne suffit pas"),
        ],
        "auteurs": [
            ("Descartes", "XVIIe s.",
             "La raison est naturelle à tous ; le doute méthodique fonde la certitude.",
             "Partie I : puissance de la raison.",
             "I : le bon sens est la chose du monde la mieux partagée."),
            ("Hume", "XVIIIe s.",
             "La raison est esclave des passions ; elle ne motive pas l'action seule.",
             "Partie II : limites de la raison.",
             "II : la raison calcule, mais ce sont les passions qui poussent à agir."),
            ("Kant", "XVIIIe s.",
             "La raison pratique commande le devoir ; la raison pure a des limites (antinomies).",
             "Raison théorique vs pratique.",
             "III : la raison pratique fonde la morale autonome."),
        ],
        "citations": [
            ("Le cœur a ses raisons que la raison ne connaît point.", "Pascal", "Pensées",
             "limites de la raison discursive"),
        ],
        "retenir": [
            "Raison théorique vs pratique (Kant)",
            "Hume : raison esclave des passions",
            "Doute méthodique (Descartes)",
            "Raison instrumentale (critique d'Adorno)",
        ],
        "reflexion": [
            "La raison suffit-elle à vivre ?",
            "Raison et foi sont-elles compatibles ?",
        ],
    },
    "religion": {
        "intro": (
            "<p>La religion relie l'homme au sacré et à la transcendance. Illusion, sagesse ou exigence de vérité ? "
            "Notion essentielle pour penser foi, raison et morale.</p>"
        ),
        "categories": [
            ("Foi", "Croyance, révélation, Augustin", "Croire pour comprendre"),
            ("Critiques", "Marx, Feuerbach, Freud", "Religion comme illusion"),
            ("Morale", "Kant, autonomie, laïcité", "Religion et éthique"),
        ],
        "auteurs": [
            ("Kant", "XVIIIe s.",
             "La religion morale postule Dieu, l'immortalité et la liberté ; la morale peut s'autonomiser.",
             "Partie II-III.",
             "II : la morale ne dépend pas de la religion, mais peut y trouver un appui."),
            ("Marx", "XIXe s.",
             "La religion est l'opium du peuple — elle apaise la souffrance sociale sans la supprimer.",
             "Critique sociale.",
             "I : la religion reflète et masque les inégalités."),
            ("Weber", "XXe s.",
             "Le désenchantement du monde : la modernité rationnelle écarte le religieux.",
             "Sécularisation.",
             "III : la science et la bureaucratie remplacent la magie."),
        ],
        "citations": [
            ("La religion est l'opium du peuple.", "Marx", "1844",
             "critique sociale de la religion"),
        ],
        "retenir": [
            "Foi vs raison",
            "Credo ut intelligam (Augustin)",
            "Laïcité et liberté de conscience",
            "Désenchantement (Weber)",
        ],
        "reflexion": [
            "La religion est-elle nécessaire à la morale ?",
            "Peut-on vivre sans religion ?",
        ],
    },
    "science": {
        "intro": (
            "<p>La science produit des connaissances objectives par l'expérience et la raison. Mais explique-t-elle tout ? "
            "Peut-elle répondre aux questions de sens, de valeur et d'existence ?</p>"
        ),
        "categories": [
            ("Méthode", "Expérience, falsification, paradigmes", "Comment la science progresse"),
            ("Portée", "Vérité, limites, éthique", "Ce que la science peut/ne peut pas"),
            ("Rapports", "Religion, technique, philosophie", "Science et autres formes de savoir"),
        ],
        "auteurs": [
            ("Popper", "XXe s.",
             "Une théorie scientifique doit être réfutable (falsifiable) pour être scientifique.",
             "Critère de scientificité.",
             "I : la science avance par réfutation, pas par confirmation."),
            ("Kuhn", "XXe s.",
             "Les sciences progressent par révolutions de paradigmes, pas par accumulation linéaire.",
             "Histoire des sciences.",
             "II : ce qui est « évident » dépend du paradigme dominant."),
            ("Heidegger", "XXe s.",
             "La science ne pense pas l'être ; elle calcule et mesure.",
             "Limites de la science.",
             "III : la science ne répond pas aux questions existentielles."),
        ],
        "citations": [
            ("La science ne pense pas.", "Heidegger", "1953",
             "limites de la science"),
        ],
        "retenir": [
            "Falsifiabilité (Popper)",
            "Paradigme et révolutions (Kuhn)",
            "Positivisme (Comte)",
            "Science ≠ opinion (méthode)",
        ],
        "reflexion": [
            "La science explique-t-elle tout ?",
            "Peut-on croire la science sur parole ?",
        ],
    },
    "technique": {
        "intro": (
            "<p>La technique transforme le monde. Libère-t-elle l'homme ou l'aliène-t-elle ? Est-elle neutre ou "
            "porte-t-elle des valeurs ? Enjeu majeur avec l'IA et l'écologie.</p>"
        ),
        "categories": [
            ("Outil", "Techne, moyen au service de fins", "La technique au service de l'homme"),
            ("Autonomie", "Ellul, logique propre de la technique", "La technique nous dépasse"),
            ("Éthique", "Jonas, responsabilité, Heidegger", "Maîtriser la technique"),
        ],
        "auteurs": [
            ("Heidegger", "XXe s.",
             "La technique moderne enframe (Gestell) le monde : tout devient ressource.",
             "Partie II : danger de la technique.",
             "II : la rivière n'est plus un paysage, mais une centrale hydraulique."),
            ("Ellul", "XXe s.",
             "La technique suit sa propre logique autonome, indépendamment des choix humains.",
             "Technique et autonomie.",
             "II : la technique se développe pour elle-même."),
            ("Jonas", "XXe s.",
             "Le principe responsabilité : nous devons aux générations futures face aux techniques destructrices.",
             "Éthique contemporaine.",
             "III : la puissance technique exige une éthique nouvelle."),
        ],
        "citations": [
            ("Partout où il y a la technique, il y a le danger.", "Heidegger", "La question de la technique",
             "technique et risque"),
        ],
        "retenir": [
            "Techne = savoir-faire",
            "Gestell = arrimage (Heidegger)",
            "Technique autonome (Ellul)",
            "Principe responsabilité (Jonas)",
        ],
        "reflexion": [
            "La technique est-elle neutre ?",
            "L'IA est-elle une menace ou une opportunité ?",
        ],
    },
    "temps": {
        "intro": (
            "<p>Le temps structure notre vie : passé, présent, futur. Est-il une réalité objective ou une construction "
            "de l'esprit ? Notion liée à la conscience, la mémoire et la mort.</p>"
        ),
        "categories": [
            ("Objectif", "Chronologie, physique, Aristote", "Le temps mesurable"),
            ("Subjectif", "Durée vécue, Bergson, Augustin", "Le temps de la conscience"),
            ("Existentiel", "Finitude, Heidegger, être-pour-la-mort", "Le temps de l'existence"),
        ],
        "auteurs": [
            ("Augustin", "IVe-Ve s.",
             "Le temps est dans l'âme : mémoire (passé), attention (présent), attente (futur).",
             "Partie II : subjectivité du temps.",
             "II : le présent du passé est la mémoire."),
            ("Bergson", "XIXe-XXe s.",
             "La durée vécue ne se réduit pas au temps spatial ni au chronomètre.",
             "Durée qualitative.",
             "II : dix minutes d'attente ne valent pas dix minutes de joie."),
            ("Heidegger", "XXe s.",
             "L'être-pour-la-mort structure le temps de l'existence (Dasein).",
             "Temporalité existentielle.",
             "III : conscience de la finitude donne urgence au vivre."),
        ],
        "citations": [
            ("Qu'est-ce donc que le temps ? Si personne ne m'interroge, je le sais ; si je veux l'expliquer, je ne le sais plus.", "Augustin", "Confessions XI",
             "difficulté à définir le temps"),
        ],
        "retenir": [
            "Temps chronologique vs durée vécue",
            "Temps cyclique vs linéaire",
            "Kant : temps = forme a priori",
            "Être-pour-la-mort (Heidegger)",
        ],
        "reflexion": [
            "Le temps existe-t-il indépendamment de nous ?",
            "Peut-on maîtriser le temps ?",
        ],
    },
    "travail": {
        "intro": (
            "<p>Le travail est au cœur de notre vie : nécessité économique, source de dignité ou aliénation ? "
            "Avec l'automatisation, peut-on imaginer une société sans travail ?</p>"
        ),
        "categories": [
            ("Nécessité", "Subvenir aux besoins, survie", "Travailler pour vivre"),
            ("Aliénation", "Marx, capitalisme, exploitation", "Le travail qui asservit"),
            ("Réalisation", "Dignité, reconnaissance, loisir", "Le travail qui libère"),
        ],
        "auteurs": [
            ("Marx", "XIXe s.",
             "Sous le capitalisme, le travail est aliéné : le travailleur ne s'approprie pas le produit de son œuvre.",
             "Partie II : critique de l'aliénation.",
             "II : l'ouvrier devient accessoire de la machine."),
            ("Arendt", "XXe s.",
             "Distingue travail (nécessité), œuvre (fabrication durable) et action (politique).",
             "Typologie de l'activité humaine.",
             "III : le travail ne définit pas toute la vie humaine."),
            ("Aristote", "IVe s. av. J.-C.",
             "Le loisir (skholè) est supérieur au travail servile ; la philosophie exige le loisir.",
             "Travail vs contemplation.",
             "I : le travail est nécessaire mais n'est pas la fin suprême."),
        ],
        "citations": [
            ("Le travail libère l'homme, le travail aliéné l'asservit.", "Marx", "Manuscrits de 1844",
             "distinction travail libre/aliéné"),
        ],
        "retenir": [
            "Aliénation (Marx)",
            "Travail / œuvre / action (Arendt)",
            "Loisir (skholè) vs travail servile",
            "Travail et propriété (Locke)",
        ],
        "reflexion": [
            "Le travail est-il une nécessité ?",
            "Peut-on aimer son travail sous le capitalisme ?",
        ],
    },
    "verite": {
        "intro": (
            "<p>La vérité est ce en quoi nous croyons quand nous disons vrai. Mais existe-t-elle une vérité unique ? "
            "Comment la reconnaître ? Notion centrale de la perspective « La connaissance ».</p>"
        ),
        "categories": [
            ("Correspondance", "Accord esprit/réalité, Descartes", "Dire vrai = correspondre"),
            ("Révélation", "Aletheia, Heidegger, dévoilement", "La vérité comme apparition"),
            ("Relativisme", "Nietzsche, perspectives, interprétations", "Pas de faits, que des interprétations"),
        ],
        "auteurs": [
            ("Platon", "IVe s. av. J.-C.",
             "La vérité est l'Idée intelligible ; le monde sensible n'en est qu'une ombre.",
             "Allégorie de la caverne.",
             "I : les ombres ne sont pas la réalité."),
            ("Descartes", "XVIIe s.",
             "La vérité claire et distincte est critère de certitude rationnelle.",
             "Évidence.",
             "I : ce que je perçois clairement est vrai."),
            ("Nietzsche", "XIXe s.",
             "Il n'y a pas de faits, seulement des interprétations ; la vérité est une illusion utile.",
             "Partie II : perspectivisme.",
             "II : chaque perspective produit sa « vérité »."),
            ("Heidegger", "XXe s.",
             "L'essence de la vérité est le dévoilement (aletheia) : l'être se révèle.",
             "Partie III : vérité ontologique.",
             "III : la vérité n'est pas seulement propositionalle."),
        ],
        "citations": [
            ("Il n'y a pas de faits, il n'y a que des interprétations.", "Nietzsche", "Fragment posthume",
             "relativisme de la vérité"),
        ],
        "retenir": [
            "Adaequatio = correspondance",
            "Aletheia = dévoilement (Heidegger)",
            "Vérité vs opinion",
            "Perspectivisme (Nietzsche)",
        ],
        "reflexion": [
            "La vérité existe-t-elle ?",
            "La vérité est-elle toujours bonne à dire ?",
        ],
    },
}

METHODOLOGIE_PEDAGOGIE = {
    "intro": (
        "<p>L'épreuve de philosophie au bac n'évalue pas votre culture encyclopédique, mais votre capacité à "
        "<strong>penser par vous-même</strong> en mobilisant des concepts, des auteurs et des exemples. "
        "Ce guide vous accompagne pas à pas — prenez le temps de chaque étape.</p>"
    ),
    "dissertation_etapes": [
        ("1. Analyser le sujet", "Soulignez les mots-clés, repérez l'énoncé (question, paradoxe, citation). Ne vous précipitez pas."),
        ("2. Définir les termes", "Donnez 2-3 définitions possibles (dictionnaire, philosophique, courant). Montrez qu'un terme peut avoir plusieurs sens."),
        ("3. Formuler la problématique", "Transformez le sujet en question précise. Ex. : « La liberté est-elle une illusion ? » → « En quoi la liberté peut-elle apparaître comme illusion, et en quoi demeure-t-elle une exigence ? »"),
        ("4. Construire le plan dialectique", "I = thèse (on montre que…), II = antithèse (mais…), III = dépassement (néanmoins, en un sens plus profond…)."),
        ("5. Rédiger", "Chaque partie : sous-thèse + argument + exemple + citation d'auteur. Conclusion : bilan sans répéter l'intro."),
    ],
    "explication_etapes": [
        ("1. Situer le texte", "Qui est l'auteur ? Quand ? Dans quel ouvrage ? Quel courant ?"),
        ("2. Annoncer le fil directeur", "Une phrase qui résume l'idée force du passage."),
        ("3. Explication linéaire", "Suivez le texte dans l'ordre. Expliquez chaque étape du raisonnement."),
        ("4. Discussion", "Critiquez ou prolongez : limites, présupposés, lien avec d'autres auteurs."),
    ],
}

LEARNING_CARDS_GLOBAL = [
    {
        "id": "learn-cogito",
        "theme": "citations",
        "front": "« Je pense, donc je suis »",
        "back": "Descartes — Méditations métaphysiques. Certitude de la conscience de soi. Partie I sur la conscience.",
        "importance": 3,
    },
    {
        "id": "learn-kant-ic",
        "theme": "citations",
        "front": "« Agis uniquement d'après la maxime qui peut valoir loi universelle »",
        "back": "Kant — Impératif catégorique. Fondement du devoir. Notions devoir, liberté, justice.",
        "importance": 3,
    },
    {
        "id": "learn-sartre",
        "theme": "citations",
        "front": "« L'homme est condamné à être libre »",
        "back": "Sartre — L'existentialisme est un humanisme (1946). Liberté et responsabilité. Notion liberté.",
        "importance": 3,
    },
    {
        "id": "learn-hobbes",
        "theme": "citations",
        "front": "« L'homme est un loup pour l'homme »",
        "back": "Hobbes — De cive. État de nature et nécessité de l'État. Notion État.",
        "importance": 3,
    },
    {
        "id": "learn-rousseau",
        "theme": "citations",
        "front": "« L'homme naît libre, et partout il est dans les fers »",
        "back": "Rousseau — Contrat social (1762). Liberté naturelle vs aliénation sociale. Notions liberté, État, nature.",
        "importance": 3,
    },
    {
        "id": "learn-marx",
        "theme": "citations",
        "front": "« La religion est l'opium du peuple »",
        "back": "Marx — 1844. Critique sociale de la religion. Notion religion.",
        "importance": 3,
    },
    {
        "id": "learn-freud",
        "theme": "citations",
        "front": "« La conscience n'est pas maîtresse en sa maison »",
        "back": "Freud — 1917. L'inconscient détermine nos actes. Notions conscience, inconscient.",
        "importance": 3,
    },
    {
        "id": "learn-aristote-bonheur",
        "theme": "citations",
        "front": "« Le bonheur est l'activité de l'âme conforme à la vertu »",
        "back": "Aristote — Éthique à Nicomaque. Eudaimonia. Notion bonheur.",
        "importance": 3,
    },
    {
        "id": "learn-wittgenstein",
        "theme": "citations",
        "front": "« Les limites de mon langage sont les limites de mon monde »",
        "back": "Wittgenstein — Tractatus (1921). Langage et pensée. Notion langage.",
        "importance": 3,
    },
    {
        "id": "learn-nietzsche",
        "theme": "citations",
        "front": "« Il n'y a pas de faits, il n'y a que des interprétations »",
        "back": "Nietzsche — Fragment posthume. Relativisme. Notion vérité.",
        "importance": 3,
    },
    {
        "id": "learn-plan-dialectique",
        "theme": "methodologie",
        "front": "Plan dialectique en 3 parties",
        "back": "I = Thèse (on montre que le sujet semble vrai). II = Antithèse (mais l'opposé se défend). III = Dépassement (nuance, synthèse, sens plus profond).",
        "importance": 3,
    },
    {
        "id": "learn-problematique",
        "theme": "methodologie",
        "front": "Qu'est-ce qu'une problématique ?",
        "back": "La question précise à laquelle le sujet invite à répondre. Elle reformule le sujet en question philosophique, pas une simple recopie.",
        "importance": 3,
    },
    {
        "id": "learn-legal-legitime",
        "theme": "reperes",
        "front": "Légal vs légitime",
        "back": "Légal = conforme à la loi écrite. Légitime = moralement fondé. Une loi peut être légale sans être légitime.",
        "importance": 3,
    },
    {
        "id": "learn-obj-subj",
        "theme": "reperes",
        "front": "Objectif vs subjectif",
        "back": "Objectif = indépendant du sujet qui observe. Subjectif = relatif à la perception ou au jugement personnel.",
        "importance": 2,
    },
    {
        "id": "learn-liberte-berlin",
        "theme": "reperes",
        "front": "Liberté négative vs positive (Berlin)",
        "back": "Négative = absence d'entraves extérieures. Positive = capacité d'être auteur de ses choix (autonomie).",
        "importance": 3,
    },
]


NOTION_PLANS = {
    "art": ("L'art n'est-il qu'une imitation de la nature ?", [
        ("I", "Thèse : l'imitation définit l'art", "Mimesis ; l'art représente le réel", "Platon, Aristote"),
        ("II", "Antithèse : l'art dépasse la copie", "Création, expression, art pour l'art", "Kant, romantisme"),
        ("III", "Dépassement : l'art révèle une vérité", "L'œuvre ouvre un monde", "Heidegger"),
    ]),
    "bonheur": ("Le bonheur est-il le but de la vie humaine ?", [
        ("I", "Thèse : tout homme aspire au bonheur", "Fin naturelle de l'action humaine", "Aristote, Épicure"),
        ("II", "Antithèse : le bonheur n'épuise pas la vie", "Devoir, vérité, justice la dépassent", "Kant, stoïciens"),
        ("III", "Dépassement : un aspect de la vie bonne", "Le bonheur compte mais n'est pas la seule fin", "Mill, synthèse"),
    ]),
    "conscience": ("La conscience fait-elle la grandeur de l'homme ?", [
        ("I", "Thèse : la conscience fonde la dignité", "Cogito, conscience morale", "Descartes, Kant"),
        ("II", "Antithèse : la conscience est limitée", "Inconscient, idéologie, illusions", "Freud, Marx"),
        ("III", "Dépassement : quête de vérité", "La grandeur dépasse la conscience immédiate", "Hegel, Sartre"),
    ]),
    "devoir": ("Le devoir est-il une contrainte ?", [
        ("I", "Thèse : le devoir contraint", "Obligation contre les inclinations", "Kant"),
        ("II", "Antithèse : contrainte de la raison", "Dignité et autonomie", "Kant, Hegel"),
        ("III", "Dépassement : liberté intérieure", "Agir par devoir = être libre", "Kant, Levinas"),
    ]),
    "etat": ("L'État est-il un mal nécessaire ?", [
        ("I", "Thèse : l'État contraint", "Lois, force, obéissance", "Hobbes"),
        ("II", "Antithèse : sans État, chaos", "Guerre de tous contre tous", "Hobbes, Locke"),
        ("III", "Dépassement : condition de liberté", "L'État peut réaliser la justice", "Rousseau, Hegel"),
    ]),
    "inconscient": ("L'inconscient met-il en cause la liberté humaine ?", [
        ("I", "Thèse : l'inconscient détermine", "Pulsions, refoulement, lapsus", "Freud, Schopenhauer"),
        ("II", "Antithèse : prise de conscience possible", "Psychanalyse, lucidité", "Freud"),
        ("III", "Dépassement : liberté redéfinie", "Responsabilité malgré les déterminismes", "Sartre"),
    ]),
    "justice": ("La justice est-elle l'affaire de l'État ?", [
        ("I", "Thèse : l'État instaure la justice", "Lois, institutions, coercition", "Hobbes, Hegel"),
        ("II", "Antithèse : la justice dépasse l'État", "Conscience morale, droit naturel", "Platon, Kant"),
        ("III", "Dépassement : nécessaire mais pas suffisant", "L'État + citoyens justes", "Rawls, Arendt"),
    ]),
    "langage": ("Le langage traduit-il la pensée ?", [
        ("I", "Thèse : le langage exprime la pensée", "Traduction fidèle de l'intérieur", "Descartes"),
        ("II", "Antithèse : le langage structure la pensée", "Limites du langage = limites du monde", "Wittgenstein, Saussure"),
        ("III", "Dépassement : co-naissance", "Ni simple traduction ni identité", "Heidegger, Austin"),
    ]),
    "liberte": ("La liberté est-elle une illusion ?", [
        ("I", "Thèse : le déterminisme nie la liberté", "Causes naturelles, sociales, inconscientes", "Spinoza, Freud"),
        ("II", "Antithèse : l'expérience du choix", "Cogito, responsabilité", "Descartes, Sartre"),
        ("III", "Dépassement : liberté comme conquête", "Autonomie de la raison", "Kant, Spinoza"),
    ]),
    "nature": ("L'homme est-il un animal comme les autres ?", [
        ("I", "Thèse : l'homme est un animal", "Besoins, instincts, mortalité", "Biologie, évolution"),
        ("II", "Antithèse : raison et culture distinguent", "Langage, politique, technique", "Aristote, Rousseau"),
        ("III", "Dépassement : animal qui se dépasse", "Zôon logon echon", "Aristote"),
    ]),
    "raison": ("La raison suffit-elle à vivre ?", [
        ("I", "Thèse : la raison éclaire tout", "Science, morale, politique", "Descartes, Kant"),
        ("II", "Antithèse : passions, art, foi", "La raison ne réduit pas la vie", "Hume, Pascal"),
        ("III", "Dépassement : nécessaire mais non suffisante", "Vie pleine exige plus que le calcul", "Kant, Ricœur"),
    ]),
    "religion": ("La religion est-elle nécessaire à la morale ?", [
        ("I", "Thèse : la religion fonde les valeurs", "Tradition, sacré, commandements", "Théologie"),
        ("II", "Antithèse : morale autonome", "Raison pratique sans religion", "Kant"),
        ("III", "Dépassement : enrichissement possible", "La religion n'est pas nécessaire mais peut aider", "Kant, Weber"),
    ]),
    "science": ("La science explique-t-elle tout ?", [
        ("I", "Thèse : efficacité remarquable", "Phénomènes naturels et sociaux", "Bacon, Popper"),
        ("II", "Antithèse : questions de sens et valeur", "Existence, morale, art", "Heidegger, Jonas"),
        ("III", "Dépassement : beaucoup mais pas tout", "Science + autres formes de pensée", "Bachelard"),
    ]),
    "technique": ("La technique nous rend-elle libres ?", [
        ("I", "Thèse : libération des contraintes", "Travail, maladie, distance", "Bacon, Marx"),
        ("II", "Antithèse : nouvelles dépendances", "Aliénation, Gestell, autonomie technique", "Heidegger, Ellul"),
        ("III", "Dépassement : liberté si maîtrise consciente", "Responsabilité", "Jonas"),
    ]),
    "temps": ("Le temps existe-t-il ?", [
        ("I", "Thèse : réalité objective", "Physique, histoire, chronologie", "Aristote, Einstein"),
        ("II", "Antithèse : condition de l'expérience", "Temps de l'âme, durée vécue", "Augustin, Bergson, Kant"),
        ("III", "Dépassement : existe comme condition humaine", "Ni pure illusion ni substance absolue", "Heidegger"),
    ]),
    "travail": ("Le travail est-il une nécessité ?", [
        ("I", "Thèse : nécessité matérielle", "Subvenir aux besoins", "Marx, économie"),
        ("II", "Antithèse : création et reconnaissance", "Identité, œuvre, politique", "Arendt, Ricœur"),
        ("III", "Dépassement : nécessité conditionnelle", "Technique et loisir peuvent alléger", "Aristote, Marx"),
    ]),
    "verite": ("La vérité existe-t-elle ?", [
        ("I", "Thèse : expérience fondamentale", "Évidence, science, justice", "Descartes, Platon"),
        ("II", "Antithèse : scepticisme et relativisme", "Perspectives, interprétations", "Nietzsche"),
        ("III", "Dépassement : horizon de la pensée", "Accès toujours partiel", "Heidegger, Peirce"),
    ]),
}


def build_notion_pedagogical_html(notion_id, base_html, plan_sujet=None, plan_parties=None):
    """Enrichit le HTML d'une notion avec le contenu pédagogique."""
    ped = NOTION_PEDAGOGIE.get(notion_id, {})
    if not ped:
        return base_html

    if not plan_sujet and notion_id in NOTION_PLANS:
        plan_sujet, plan_parties = NOTION_PLANS[notion_id]

    parts = []

    parts.append(pedago_box(
        "Comment travailler cette notion",
        "<p>Prenez 20–30 minutes pour cette fiche. Lisez d'abord l'introduction, puis le tableau par catégories, "
        "ensuite les auteurs un par un. Finissez par les citations et la check-list.</p>"
        + list_items(NEUROPSY_PROFILE["adaptations"][:3]),
        "guide",
    ))

    parts.append(section("Pourquoi cette notion au bac ?", ped["intro"]))

    if ped.get("categories"):
        parts.append(section("Organiser ses idées par catégories", category_table(ped["categories"])))

    parts.append(base_html)

    if ped.get("auteurs"):
        auteurs_html = '<div class="fiche-auteurs-grid">' + "".join(
            auteur_card(*a) for a in ped["auteurs"]
        ) + "</div>"
        parts.append(section("Auteurs à connaître — fiches détaillées", auteurs_html))

    if ped.get("citations"):
        cit_html = '<div class="fiche-citations-grid">' + "".join(
            citation_card(*c) for c in ped["citations"]
        ) + "</div>"
        parts.append(section("Citations à retenir et à réutiliser", cit_html))

    parts.append(pedago_box(
        "À retenir absolument",
        checklist(ped.get("retenir", [])),
        "memo",
    ))

    if plan_sujet and plan_parties:
        parts.append(section("Plan de dissertation commenté", plan_detaille(plan_sujet, plan_parties)))

    if ped.get("reflexion"):
        parts.append(section(
            "Exercices de réflexion (avant le QCM)",
            "<p>Reformulez vos réponses à l'oral ou par écrit. Ne cherchez pas la perfection — "
            "cherchez à <strong>développer</strong> votre pensée au-delà du descriptif.</p>"
            + list_items(ped["reflexion"]),
        ))

    return "".join(parts)


def build_methodologie_pedagogical_html(base_html):
    etapes_diss = "<ol class='fiche-etapes'>" + "".join(
        f"<li><strong>{t}</strong> — {d}</li>" for t, d in METHODOLOGIE_PEDAGOGIE["dissertation_etapes"]
    ) + "</ol>"
    etapes_expl = "<ol class='fiche-etapes'>" + "".join(
        f"<li><strong>{t}</strong> — {d}</li>" for t, d in METHODOLOGIE_PEDAGOGIE["explication_etapes"]
    ) + "</ol>"

    return (
        pedago_box("Parcours adapté à votre profil", "<p>" + NEUROPSY_PROFILE["conseil"] + "</p>"
                   + list_items(NEUROPSY_PROFILE["forces"] + NEUROPSY_PROFILE["adaptations"]), "profile")
        + section("Comprendre l'épreuve", METHODOLOGIE_PEDAGOGIE["intro"])
        + section("La dissertation — étape par étape", etapes_diss)
        + section("L'explication de texte — étape par étape", etapes_expl)
        + base_html
        + pedago_box("Conseil final", "<p>À l'épreuve, accordez-vous 45 minutes pour l'introduction et le plan. "
                     "La qualité de la problématique et du plan compte autant que le volume.</p>", "tip")
    )
