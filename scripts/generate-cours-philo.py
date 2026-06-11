#!/usr/bin/env python3
"""Generate data/cours-philo.json with all 17 bac philosophy notions."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from philo_pedagogie import (
    NEUROPSY_PROFILE,
    PERSPECTIVES,
    build_methodologie_pedagogical_html,
    build_notion_pedagogical_html,
)

def section(title, body):
    return f'<section class="fiche-section"><h3>{title}</h3>{body}</section>'

def quote(text, author):
    return f'<blockquote class="fiche-quote"><p>« {text} »</p><cite>— {author}</cite></blockquote>'

def list_items(items):
    return '<ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'

NOTIONS = [
    {
        "id": "art",
        "title": "L'art",
        "perspective": "L'existence humaine et la culture",
        "summary": "Création, beauté, imitation et expression : l'art est-il une connaissance ou une illusion ?",
        "html": section("Problématique centrale",
            "<p>L'art interroge le rapport entre l'homme et le monde : imite-t-il la réalité, la transfigure-t-il ou la trahit-il ? "
            "Est-il un langage universel, un plaisir sensible ou une forme de connaissance ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Art (au sens large)</strong> : activité créatrice visant la beauté ou l'expression (peinture, musique, littérature, théâtre…).",
            "<strong>Mimesis</strong> (Platon, Aristote) : imitation de la nature ou des idées.",
            "<strong>Beau</strong> : harmonie, proportion (classique) ou expression du sensible (romantique).",
            "<strong>Art pour l'art</strong> : l'œuvre vaut par elle-même, indépendamment de toute utilité morale ou sociale.",
            "<strong>Distinction art / technique</strong> : la technique obéit à une fin extérieure ; l'art peut se suffire à soi-même."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Platon</strong> : l'art est une copie trompeuse des apparences ; le poète est banni de la Cité idéale.",
            "<strong>Aristote</strong> : la tragédie purifie les passions (catharsis) ; l'art imite l'action humaine pour la comprendre.",
            "<strong>Kant</strong> : le jugement de goût est désintéressé ; le beau naît d'un « accord libre » entre l'entendement et l'imagination.",
            "<strong>Hegel</strong> : l'art est une forme de l'Esprit ; il exprime une époque avant de céder la place à la religion et à la philosophie.",
            "<strong>Schopenhauer</strong> : l'art suspend la volonté de vivre et révèle l'essence du monde.",
            "<strong>Heidegger</strong> : l'œuvre d'art ouvre un monde et fait apparaître la vérité.",
            "<strong>Adorno</strong> : l'art authentique résiste à la standardisation de la société de masse."
        ])) +
        quote("L'art est l'activité qui permet à la vérité de prendre son essor.", "Heidegger") +
        section("Débats", list_items([
            "L'art doit-il être <strong>moral</strong> (engagé) ou <strong>autonome</strong> ?",
            "Peut-on définir le <strong>beau</strong> de façon objective ?",
            "L'art contemporain (ready-made, performance) est-il encore de l'art ?",
            "L'art imite-t-il la <strong>nature</strong> ou la <strong>vérité</strong> ?"
        ])) +
        section("Articulations avec d'autres notions", list_items([
            "<strong>La technique</strong> : outil de création ou menace d'industrialisation de l'art ?",
            "<strong>La vérité</strong> : l'art révèle-t-il une vérité que la science ignore ?",
            "<strong>La liberté</strong> : création libre ou contrainte par les normes esthétiques ?",
            "<strong>Le travail</strong> : l'artiste travaille-t-il ou joue-t-il ?"
        ])) +
        section("Sujets de dissertation possibles", list_items([
            "L'art n'est-il qu'une imitation de la nature ?",
            "L'art peut-il se passer de règles ?",
            "L'art a-t-il une fonction morale ?",
            "Peut-on parler de vérité en art ?"
        ])) +
        section("Plan type (exemple)", "<p><strong>Sujet :</strong> L'art n'est-il qu'une imitation de la nature ?</p>" +
            "<p><strong>I.</strong> L'imitation paraît constitutive de l'art (mimesis platonicienne et aristotélicienne).</p>" +
            "<p><strong>II.</strong> Mais l'art dépasse la simple copie : création, expression, transfiguration.</p>" +
            "<p><strong>III.</strong> L'art n'imite pas seulement la nature : il révèle une vérité sur l'homme et le monde.</p>")
    },
    {
        "id": "bonheur",
        "title": "Le bonheur",
        "perspective": "L'existence humaine et la culture",
        "summary": "Le bonheur est-il le but de la vie, un droit ou une illusion ? Plaisir, vertu ou sagesse ?",
        "html": section("Problématique centrale",
            "<p>Le bonheur semble être ce que tout homme désire. Mais qu'est-ce que le bonheur ? "
            "Un état passager de plaisir, une vie conforme à la vertu, ou un idéal inaccessible ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Bonheur (eudaimonia)</strong> : pour Aristote, activité de l'âme conforme à la vertu.",
            "<strong>Plaisir (hédonisme)</strong> : maximiser les plaisirs, minimiser les souffrances (Épicure, Bentham).",
            "<strong>Bonheur et contentement</strong> : le bonheur peut exiger l'effort ; le contentement se contente de peu.",
            "<strong>Bonheur et devoir</strong> : peut-on être heureux en respectant des obligations contraignantes ?"
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Aristote</strong> : le bonheur est la fin suprême de l'action humaine ; il suppose la vertu et une vie active.",
            "<strong>Épicure</strong> : le bonheur est l'ataraxie (absence de trouble) obtenue par la modération des désirs.",
            "<strong>Les stoïciens</strong> (Épictète, Marc Aurèle) : le bonheur dépend de notre jugement, non des événements extérieurs.",
            "<strong>Kant</strong> : le bonheur ne peut fonder la morale ; le devoir prime sur la quête du bonheur.",
            "<strong>Schopenhauer</strong> : la vie est essentiellement souffrance ; le bonheur n'est qu'une absence temporaire de douleur.",
            "<strong>Mill</strong> : il vaut mieux être Socrate insatisfait qu'un imbécile satisfait (qualité des plaisirs)."
        ])) +
        quote("Le bonheur est l'activité de l'âme conforme à la vertu.", "Aristote") +
        section("Débats", list_items([
            "Le bonheur est-il <strong>subjectivement</strong> ressenti ou <strong>objectivement</strong> défini ?",
            "Peut-on être heureux sans être <strong>libre</strong> ?",
            "Le bonheur est-il compatible avec le <strong>devoir</strong> et la <strong>justice</strong> ?",
            "La société a-t-elle le devoir de garantir le bonheur de tous ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La liberté</strong> : le bonheur exige-t-il l'autonomie ?",
            "<strong>Le devoir</strong> : sacrifier son bonheur pour le devoir est-il raisonnable ?",
            "<strong>La conscience</strong> : un bonheur coupable est-il possible ?",
            "<strong>Le travail</strong> : le travail contribue-t-il au bonheur ou l'en empêche-t-il ?"
        ])) +
        section("Sujets possibles", list_items([
            "Le bonheur est-il le but de la vie humaine ?",
            "Peut-on être heureux sans être libre ?",
            "Le devoir s'oppose-t-il au bonheur ?",
            "Le bonheur est-il une illusion ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> Le bonheur est-il le but de la vie humaine ?</p>" +
            "<p><strong>I.</strong> Tout homme aspire au bonheur ; il semble être la fin naturelle de l'existence.</p>" +
            "<p><strong>II.</strong> Mais le bonheur n'épuise pas la vie humaine : devoir, vérité, justice la dépassent.</p>" +
            "<p><strong>III.</strong> Le bonheur n'est qu'un aspect de la vie bonne, non son unique fin.</p>")
    },
    {
        "id": "conscience",
        "title": "La conscience",
        "perspective": "L'existence humaine et la culture",
        "summary": "Conscience de soi, morale et unité du sujet : sommes-nous maîtres de notre pensée ?",
        "html": section("Problématique centrale",
            "<p>La conscience désigne à la fois la conscience de soi (je pense), la conscience morale (le remords) "
            "et la conscience éveillée (par opposition au sommeil). Qu'est-ce qui unit ces usages ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Conscience réflexive</strong> : prise de conscience de soi comme sujet pensant (Descartes).",
            "<strong>Conscience morale</strong> : sentiment du bien et du mal, voix intérieure (Rousseau, Kant).",
            "<strong>Conscience immédiate / réflexive</strong> : conscience sans réflexion vs conscience de sa conscience.",
            "<strong>Distinction conscience / inconscient</strong> : une part de nous échappe-t-elle à la conscience ?"
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Descartes</strong> : la conscience de penser est indubitable (« Je pense, donc je suis »).",
            "<strong>Locke</strong> : la conscience personnelle fonde l'identité du moi à travers le temps.",
            "<strong>Rousseau</strong> : la conscience morale est naturelle ; la société la corrompt.",
            "<strong>Kant</strong> : la conscience morale révèle la loi universelle en nous (impératif catégorique).",
            "<strong>Hegel</strong> : la conscience se déploie historiquement vers la reconnaissance mutuelle.",
            "<strong>Freud</strong> : l'inconscient détermine une grande part de nos actes ; la conscience n'est pas maîtresse en sa maison.",
            "<strong>Sartre</strong> : la conscience est toujours conscience de quelque chose ; elle est liberté et responsabilité."
        ])) +
        quote("La conscience fait l'unité de l'être en le rendant présent à soi.", "Hegel") +
        section("Débats", list_items([
            "La conscience est-elle le fondement de la <strong>liberté</strong> ?",
            "La conscience morale est-elle <strong>innée</strong> ou <strong>acquise</strong> ?",
            "Peut-on agir contre sa conscience ?",
            "L'inconscient menace-t-il l'unité du sujet conscient ?"
        ])) +
        section("Articulations", list_items([
            "<strong>L'inconscient</strong> : dualisme ou complémentarité ?",
            "<strong>La liberté</strong> : sans conscience, pas de responsabilité morale.",
            "<strong>La religion</strong> : liberté de conscience et foi.",
            "<strong>La justice</strong> : le juge peut-il juger une conscience ?"
        ])) +
        section("Sujets possibles", list_items([
            "La conscience fait-elle la grandeur de l'homme ?",
            "Peut-on avoir conscience de tout ce qui nous arrive ?",
            "La conscience morale est-elle innée ?",
            "La conscience est-elle compatible avec l'inconscient ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La conscience fait-elle la grandeur de l'homme ?</p>" +
            "<p><strong>I.</strong> La conscience distingue l'homme de l'animal et fonde sa dignité (Descartes, Kant).</p>" +
            "<p><strong>II.</strong> Mais la conscience est limitée, partielle, parfois illusoire (Freud, Marx).</p>" +
            "<p><strong>III.</strong> La grandeur de l'homme ne réside pas seulement dans la conscience mais dans sa quête de vérité.</p>")
    },
    {
        "id": "devoir",
        "title": "Le devoir",
        "perspective": "La morale et la politique",
        "summary": "Obligation morale, loi et responsabilité : d'où vient le devoir et pourquoi l'accomplir ?",
        "html": section("Problématique centrale",
            "<p>Le devoir commande indépendamment de nos inclinations. Mais d'où vient-il ? "
            "Est-il fondé sur la raison, la tradition, le contrat social ou la conscience ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Devoir</strong> : ce qu'il faut faire, indépendamment de ce que l'on veut.",
            "<strong>Obligation / contrainte</strong> : l'obligation morale diffère de la contrainte physique ou légale.",
            "<strong>Devoir et droit</strong> : mon devoir correspond souvent au droit d'autrui.",
            "<strong>Impératif catégorique</strong> (Kant) : agis uniquement d'après la maxime qui peut valoir loi universelle."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Kant</strong> : le devoir est commandé par la raison pratique ; agir par devoir, c'est agir par respect de la loi morale.",
            "<strong>Rousseau</strong> : l'homme naturel est bon ; la société crée des devoirs artificiels.",
            "<strong>Hegel</strong> : le devoir s'incarne dans les institutions (famille, société civile, État).",
            "<strong>Mill</strong> : le devoir peut être justifié par ses conséquences sur le bonheur général (utilitarisme).",
            "<strong>Levinas</strong> : le devoir envers autrui précède toute loi ; la responsabilité est infinie."
        ])) +
        quote("Agis de telle sorte que tu traites l'humanité, aussi bien dans ta personne que dans celle d'autrui, toujours en même temps comme une fin, jamais simplement comme un moyen.", "Kant") +
        section("Débats", list_items([
            "Le devoir s'oppose-t-il au <strong>bonheur</strong> ?",
            "Peut-on avoir un devoir envers soi-même ?",
            "Le devoir est-il universel ou relatif à une culture ?",
            "Faut-il obéir à un devoir injuste ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La liberté</strong> : le devoir limite-t-il ou réalise-t-il la liberté ?",
            "<strong>La justice</strong> : le juste est-il toujours mon devoir ?",
            "<strong>L'État</strong> : le citoyen a-t-il le devoir d'obéir aux lois ?",
            "<strong>La conscience</strong> : le devoir de désobéir civile."
        ])) +
        section("Sujets possibles", list_items([
            "Le devoir est-il une contrainte ?",
            "Peut-on choisir son devoir ?",
            "Le devoir s'oppose-t-il au bonheur ?",
            "Avons-nous des devoirs envers nous-mêmes ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> Le devoir est-il une contrainte ?</p>" +
            "<p><strong>I.</strong> Le devoir impose, contraint nos inclinations naturelles.</p>" +
            "<p><strong>II.</strong> Mais cette contrainte est celle de la raison et de la dignité humaine.</p>" +
            "<p><strong>III.</strong> Le devoir authentique est liberté intérieure, non aliénation.</p>")
    },
    {
        "id": "etat",
        "title": "L'État",
        "perspective": "La morale et la politique",
        "summary": "Souveraineté, loi et pouvoir : pourquoi l'État existe-t-il et quelles sont ses limites ?",
        "html": section("Problématique centrale",
            "<p>L'État organise la vie collective par des lois et un pouvoir coercitif. "
            "Est-il une nécessité rationnelle, un mal nécessaire ou l'expression de la liberté politique ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>État</strong> : ensemble d'institutions exerçant le pouvoir politique sur un territoire.",
            "<strong>Souveraineté</strong> : pouvoir suprême de faire et d'appliquer les lois.",
            "<strong>État de nature / État civil</strong> (Hobbes, Locke, Rousseau) : condition hypothétique avant l'institution politique.",
            "<strong>Légal / légitime</strong> : une loi peut être légale sans être légitime."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Hobbes</strong> : l'État (Léviathan) met fin à la guerre de tous contre tous ; l'obéissance garantit la sécurité.",
            "<strong>Locke</strong> : l'État protège les droits naturels (vie, liberté, propriété) ; le pouvoir est limité.",
            "<strong>Rousseau</strong> : la souveraineté appartient au peuple ; la volonté générale fonde la légitimité.",
            "<strong>Hegel</strong> : l'État est l'incarnation de la raison dans l'histoire.",
            "<strong>Marx</strong> : l'État est un instrument de domination de classe ; il doit disparaître.",
            "<strong>Arendt</strong> : distingue pouvoir (action collective) et violence (instrument de contrainte)."
        ])) +
        quote("L'homme est un loup pour l'homme.", "Hobbes") +
        section("Débats", list_items([
            "L'État est-il un <strong>mal nécessaire</strong> ou une <strong>réalisation de la liberté</strong> ?",
            "Peut-on désobéir à l'État ?",
            "L'État doit-il garantir le <strong>bonheur</strong> ou seulement la <strong>justice</strong> ?",
            "État-nation vs mondialisation."
        ])) +
        section("Articulations", list_items([
            "<strong>La liberté</strong> : l'État protège ou menace-t-il les libertés ?",
            "<strong>La justice</strong> : l'État est-il le garant de la justice distributive ?",
            "<strong>Le devoir</strong> : devoir de citoyenneté et désobéissance civile.",
            "<strong>La technique</strong> : État et surveillance numérique."
        ])) +
        section("Sujets possibles", list_items([
            "L'État est-il un mal nécessaire ?",
            "L'État peut-il tout faire ?",
            "Peut-on vivre sans État ?",
            "L'État garantit-il la liberté ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> L'État est-il un mal nécessaire ?</p>" +
            "<p><strong>I.</strong> L'État contraint, impose des lois, use de la force.</p>" +
            "<p><strong>II.</strong> Mais sans État, c'est la guerre de tous contre tous (Hobbes).</p>" +
            "<p><strong>III.</strong> L'État n'est un mal que si on oublie qu'il est aussi condition de la liberté et de la justice.</p>")
    },
    {
        "id": "inconscient",
        "title": "L'inconscient",
        "perspective": "L'existence humaine et la culture",
        "summary": "Pulsions, rêves et déterminismes : une part de nous échappe-t-elle à la conscience ?",
        "html": section("Problématique centrale",
            "<p>L'inconscient désigne ce qui échappe à la conscience : pulsions, désirs refoulés, automatismes. "
            "Menace-t-il la liberté et la responsabilité, ou révèle-t-il une vérité sur l'homme ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Inconscient</strong> : ensemble des processus psychiques non accessibles à la conscience.",
            "<strong>Refoulement</strong> (Freud) : mécanisme par lequel des représentations inacceptables sont exclues de la conscience.",
            "<strong>Inconscient freudien / inconscient collectif</strong> (Jung) : personnel vs partagé par l'humanité.",
            "<strong>Conscient / inconscient</strong> : opposition ou complémentarité ?"
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Freud</strong> : l'inconscient détermine nos actes ; la psychanalyse vise à le rendre conscient.",
            "<strong>Leibniz</strong> : perceptions obscures préfigurent l'inconscient.",
            "<strong>Schopenhauer</strong> : la volonté, aveugle, gouverne notre vie.",
            "<strong>Nietzsche</strong> : la conscience n'est qu'une surface ; les instincts sont plus profonds.",
            "<strong>Althusser</strong> : l'idéologie agit à notre insu (inconscient idéologique).",
            "<strong>Sartre</strong> : critique de l'inconscient freudien : il nie la responsabilité du sujet."
        ])) +
        quote("La conscience n'est pas maîtresse en sa maison.", "Freud") +
        section("Débats", list_items([
            "L'inconscient prouve-t-il que nous ne sommes pas <strong>libres</strong> ?",
            "Peut-on accéder à l'inconscient par la <strong>raison</strong> seule ?",
            "L'inconscient est-il une <strong>vérité</strong> ou une construction théorique ?",
            "Sommes-nous responsables de ce qui nous échappe ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La conscience</strong> : dualisme ou unité du sujet ?",
            "<strong>La liberté</strong> : déterminisme psychique vs libre arbitre.",
            "<strong>La raison</strong> : la raison contrôle-t-elle l'inconscient ?",
            "<strong>Le langage</strong> : le lapsus révèle l'inconscient."
        ])) +
        section("Sujets possibles", list_items([
            "L'inconscient met-il en cause la liberté humaine ?",
            "Peut-on se connaître entièrement ?",
            "L'inconscient est-il une découverte ou une invention ?",
            "La raison peut-elle maîtriser l'inconscient ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> L'inconscient met-il en cause la liberté humaine ?</p>" +
            "<p><strong>I.</strong> L'inconscient détermine nos actes ; nous ne sommes pas maîtres de nous-mêmes.</p>" +
            "<p><strong>II.</strong> Mais la prise de conscience et la psychanalyse restituent une forme de liberté.</p>" +
            "<p><strong>III.</strong> L'inconscient ne nie pas la liberté : il en redéfinit les conditions.</p>")
    },
    {
        "id": "justice",
        "title": "La justice",
        "perspective": "La morale et la politique",
        "summary": "Droit, équité et légitimité : qu'est-ce qu'une société juste ?",
        "html": section("Problématique centrale",
            "<p>La justice consiste à donner à chacun ce qui lui est dû. Mais comment déterminer ce qui est dû ? "
            "Égalité formelle, équité, mérite ou droits fondamentaux ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Justice distributive</strong> : répartition équitable des biens et des charges.",
            "<strong>Justice corrective</strong> : réparation des torts (droit pénal, civil).",
            "<strong>Équité (dikaiosynè)</strong> : vertu de donner à chacun sa part (Aristote).",
            "<strong>Égalité / équité</strong> : traiter tous pareil vs adapter au cas particulier."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Platon</strong> : la justice est l'harmonie de l'âme et de la Cité ; chacun à sa place.",
            "<strong>Aristote</strong> : justice = égale proportion ; la vertu médiane dans les rapports sociaux.",
            "<strong>Rawls</strong> : justice = équité ; les principes choisis derrière un « voile d'ignorance ».",
            "<strong>Nozick</strong> : justice = respect des droits de propriété acquis légitimement.",
            "<strong>Mill</strong> : justice liée à l'utilité et à la sécurité des attentes légitimes.",
            "<strong>Arendt</strong> : le jugement politique exige prendre la place d'autrui."
        ])) +
        quote("La justice, c'est donner à chacun ce qui lui revient.", "Platon") +
        section("Débats", list_items([
            "La justice exige-t-elle l'<strong>égalité</strong> absolue ?",
            "Peut-on être juste sans être <strong>libre</strong> ?",
            "Justice et <strong>loi</strong> : une loi injuste est-elle une loi ?",
            "Justice sociale vs justice naturelle."
        ])) +
        section("Articulations", list_items([
            "<strong>L'État</strong> : garant de la justice ou source d'injustice ?",
            "<strong>La liberté</strong> : liberté et égalité sont-elles compatibles ?",
            "<strong>Le droit</strong> : le légal est-il le juste ?",
            "<strong>La technique</strong> : algorithmes et justice prédictive."
        ])) +
        section("Sujets possibles", list_items([
            "La justice est-elle l'affaire de l'État ?",
            "Peut-on définir la justice ?",
            "La justice exige-t-elle l'égalité ?",
            "Une loi injuste est-elle une loi ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La justice est-elle l'affaire de l'État ?</p>" +
            "<p><strong>I.</strong> Seul l'État a le pouvoir d'instaurer des règles justes pour tous.</p>" +
            "<p><strong>II.</strong> Mais la justice dépasse l'État : conscience morale, droit naturel.</p>" +
            "<p><strong>III.</strong> L'État est nécessaire mais pas suffisant pour la justice.</p>")
    },
    {
        "id": "langage",
        "title": "Le langage",
        "perspective": "La connaissance",
        "summary": "Parole, signes et communication : le langage exprime-t-il la pensée ou la constitue-t-il ?",
        "html": section("Problématique centrale",
            "<p>Le langage est ce qui distingue l'homme de l'animal. Mais est-il un simple outil de communication "
            "ou la condition même de la pensée et de la vérité ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Langage</strong> : système de signes articulés pour communiquer.",
            "<strong>Langue / parole</strong> (Saussure) : système social vs acte individuel d'énonciation.",
            "<strong>Signe</strong> : rapport arbitraire entre signifiant et signifié.",
            "<strong>Langage naturel / langage formel</strong> : français, anglais vs logique mathématique."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Aristote</strong> : l'homme est l'animal doué de langage (zôon logon echon) ; il exprime le juste et l'injuste.",
            "<strong>Descartes</strong> : le langage est signe de l'âme rationnelle.",
            "<strong>Rousseau</strong> : le langage naît des besoins sociaux, non de la nature.",
            "<strong>Wittgenstein</strong> : les limites de mon langage sont les limites de mon monde.",
            "<strong>Saussure</strong> : linguistique structurale ; le sens naît des différences entre signes.",
            "<strong>Heidegger</strong> : le langage est la demeure de l'être.",
            "<strong>Austin</strong> : on fait des choses en parlant (parole acte)."
        ])) +
        quote("Les limites de mon langage sont les limites de mon monde.", "Wittgenstein") +
        section("Débats", list_items([
            "Le langage reflète-t-il la <strong>pensée</strong> ou la détermine-t-il ?",
            "Existe-t-il une pensée sans langage ?",
            "Le langage peut-il mentir ? (<strong>vérité</strong>)",
            "Le langage est-il universel ou relatif aux cultures ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La raison</strong> : le langage est-il l'outil de la raison ?",
            "<strong>La vérité</strong> : dire vrai, dire faux.",
            "<strong>La liberté</strong> : liberté d'expression.",
            "<strong>La nature</strong> : langage naturel vs artificiel."
        ])) +
        section("Sujets possibles", list_items([
            "Le langage traduit-il la pensée ?",
            "Peut-on penser sans langage ?",
            "Le langage est-il un obstacle à la vérité ?",
            "Le langage fait-il l'homme ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> Le langage traduit-il la pensée ?</p>" +
            "<p><strong>I.</strong> Le langage semble être l'expression fidèle de la pensée intérieure.</p>" +
            "<p><strong>II.</strong> Mais la pensée est structurée par le langage (Wittgenstein, Saussure).</p>" +
            "<p><strong>III.</strong> Langage et pensée co-naissent ; ni simple traduction ni identité.</p>")
    },
    {
        "id": "liberte",
        "title": "La liberté",
        "perspective": "La morale et la politique",
        "summary": "Libre arbitre, autonomie et déterminisme : l'homme est-il vraiment libre ?",
        "html": section("Problématique centrale",
            "<p>La liberté est une valeur fondamentale, mais son sens est ambigu : absence de contrainte, "
            "capacité de choisir, autonomie de la volonté ? Sommes-nous libres ou déterminés ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Liberté négative</strong> : absence d'entraves extérieures (Berlin).",
            "<strong>Liberté positive</strong> : capacité d'être auteur de ses choix, autonomie.",
            "<strong>Libre arbitre</strong> : pouvoir de choisir entre plusieurs possibilités.",
            "<strong>Déterminisme</strong> : tout événement a une cause ; la liberté serait une illusion."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Descartes</strong> : la liberté de la volonté est le plus grand de nos biens.",
            "<strong>Spinoza</strong> : la liberté est connaissance de la nécessité ; agir par raison.",
            "<strong>Kant</strong> : l'homme est libre en tant qu'être rationnel, soumis à la loi morale.",
            "<strong>Sartre</strong> : l'homme est condamné à être libre ; pas d'excuse, responsabilité totale.",
            "<strong>Spinoza / déterministes</strong> : croire être libre, c'est ignorer les causes qui nous déterminent.",
            "<strong>Mill</strong> : la liberté individuelle doit être protégée sauf si elle nuit à autrui."
        ])) +
        quote("L'homme est condamné à être libre.", "Sartre") +
        section("Débats", list_items([
            "Liberté et <strong>déterminisme</strong> sont-ils compatibles ?",
            "La liberté est-elle un <strong>droit</strong> ou une <strong>capacité</strong> ?",
            "Sommes-nous libres dans la société ?",
            "La liberté a-t-elle des limites ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La conscience</strong> : condition de la responsabilité libre.",
            "<strong>Le devoir</strong> : liberté autonome vs contrainte morale.",
            "<strong>L'État</strong> : liberté politique et sécurité.",
            "<strong>La technique</strong> : libération ou aliénation ?"
        ])) +
        section("Sujets possibles", list_items([
            "La liberté est-elle une illusion ?",
            "Sommes-nous libres de nos désirs ?",
            "La liberté a-t-elle des limites ?",
            "Peut-on forcer quelqu'un à être libre ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La liberté est-elle une illusion ?</p>" +
            "<p><strong>I.</strong> Le déterminisme (causes naturelles, sociales, inconscientes) semble nier la liberté.</p>" +
            "<p><strong>II.</strong> Mais l'expérience intérieure de choisir est indubitable (Descartes, Sartre).</p>" +
            "<p><strong>III.</strong> La liberté n'est pas illusion mais conquête : autonomie de la raison et de la volonté.</p>")
    },
    {
        "id": "nature",
        "title": "La nature",
        "perspective": "L'existence humaine et la culture",
        "summary": "Physis et culture : l'homme appartient-il à la nature ou s'en distingue-t-il ?",
        "html": section("Problématique centrale",
            "<p>La nature désigne le monde physique, les instincts, ou un ordre originel. "
            "L'homme est-il un être naturel, ou la culture le sépare-t-elle de la nature ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Nature (physis)</strong> : ce qui naît, croît, s'épanouit selon sa propre loi.",
            "<strong>Nature / culture</strong> : opposition entre ce qui est inné et ce qui est acquis.",
            "<strong>État de nature</strong> : condition hypothétique de l'homme avant la société.",
            "<strong>Lois de la nature</strong> : régularités objectives (science) vs finalités (Aristote)."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Aristote</strong> : la nature agit en vue d'une fin (téléologie) ; l'homme est animal politique.",
            "<strong>Rousseau</strong> : l'homme naturel est bon ; la société le corrompt.",
            "<strong>Descartes</strong> : la nature est mécanique ; l'homme maître et possesseur de la nature.",
            "<strong>Marx</strong> : l'homme transforme la nature par le travail.",
            "<strong>Heidegger</strong> : la technique moderne réduit la nature à un stock exploitable.",
            "<strong>Jonas</strong> : responsabilité envers la nature et les générations futures."
        ])) +
        quote("L'homme naît libre, et partout il est dans les fers.", "Rousseau") +
        section("Débats", list_items([
            "Existe-t-il une <strong>nature humaine</strong> ?",
            "La culture dénature-t-elle l'homme ?",
            "L'homme doit-il <strong>dominer</strong> ou <strong>respecter</strong> la nature ?",
            "Nature et <strong>artifice</strong> (technique) : où est la limite ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La technique</strong> : transformation de la nature.",
            "<strong>La culture</strong> : dépassement ou trahison de la nature ?",
            "<strong>La liberté</strong> : l'homme est-il libre par rapport à la nature ?",
            "<strong>La science</strong> : connaissance des lois naturelles."
        ])) +
        section("Sujets possibles", list_items([
            "L'homme est-il un animal comme les autres ?",
            "La culture dénature-t-elle l'homme ?",
            "L'homme doit-il imiter la nature ?",
            "Existe-t-il une nature humaine ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> L'homme est-il un animal comme les autres ?</p>" +
            "<p><strong>I.</strong> L'homme appartient au règne animal : besoins, instincts, mortalité.</p>" +
            "<p><strong>II.</strong> Mais la raison, le langage et la culture le distinguent radicalement.</p>" +
            "<p><strong>III.</strong> L'homme est animal, mais animal capable de se dépasser (Aristote).</p>")
    },
    {
        "id": "raison",
        "title": "La raison",
        "perspective": "La connaissance",
        "summary": "Logique, critique et universalité : la raison est-elle le propre de l'homme et fondement de la vérité ?",
        "html": section("Problématique centrale",
            "<p>La raison est la faculté de penser selon des principes universels. "
            "Est-elle le fondement de la connaissance, de la morale et de la politique, ou a-t-elle des limites ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Raison théorique</strong> : connaître le vrai.",
            "<strong>Raison pratique</strong> : déterminer le bien et le devoir (Kant).",
            "<strong>Raison / expérience</strong> : connaissance a priori vs a posteriori.",
            "<strong>Raison instrumentale</strong> : calcul des moyens vs raison évaluative (valeurs)."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Platon</strong> : la raison doit gouverner l'âme (char en main).",
            "<strong>Descartes</strong> : la raison est naturelle à tous ; le doute méthodique fonde la certitude.",
            "<strong>Kant</strong> : la raison pose des questions insolubles (antinomies) ; elle doit se connaître elle-même.",
            "<strong>Hume</strong> : la raison est esclave des passions.",
            "<strong>Hegel</strong> : la raison se réalise dans l'histoire (rationalité du réel).",
            "<strong>Horkheimer/Adorno</strong> : la raison instrumentale domine la nature et mène à la barbarie.",
            "<strong>Freud</strong> : la raison ne maîtrise pas toujours l'inconscient."
        ])) +
        quote("Le cœur a ses raisons que la raison ne connaît point.", "Pascal") +
        section("Débats", list_items([
            "La raison suffit-elle à fonder la <strong>morale</strong> ?",
            "Raison et <strong>foi</strong> (religion) sont-elles compatibles ?",
            "La raison a-t-elle des <strong>limites</strong> ?",
            "Raison universelle vs relativisme culturel."
        ])) +
        section("Articulations", list_items([
            "<strong>La vérité</strong> : la raison accède-t-elle à la vérité ?",
            "<strong>La science</strong> : méthode rationnelle par excellence.",
            "<strong>La religion</strong> : raison et révélation.",
            "<strong>La technique</strong> : raison instrumentale."
        ])) +
        section("Sujets possibles", list_items([
            "La raison suffit-elle à vivre ?",
            "La raison a-t-elle des limites ?",
            "Tout ce qui est rationnel est-il raisonnable ?",
            "La raison est-elle universelle ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La raison suffit-elle à vivre ?</p>" +
            "<p><strong>I.</strong> La raison éclaire nos choix, fonde la science et la morale.</p>" +
            "<p><strong>II.</strong> Mais la vie comporte passion, intuition, art, foi que la raison ne réduit pas.</p>" +
            "<p><strong>III.</strong> La raison est nécessaire mais non suffisante pour une existence humaine pleine.</p>")
    },
    {
        "id": "religion",
        "title": "La religion",
        "perspective": "L'existence humaine et la culture",
        "summary": "Foi, transcendance et sécularisation : la religion répond-elle à un besoin humain fondamental ?",
        "html": section("Problématique centrale",
            "<p>La religion relie l'homme à une réalité transcendante (Dieu, sacré). "
            "Est-elle une illusion, une sagesse ancestrale ou une exigence de vérité ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Religion</strong> : ensemble de croyances et de pratiques liées au sacré.",
            "<strong>Foi / raison</strong> : croyance sans preuve vs connaissance démonstrative.",
            "<strong>Théisme / athéisme / agnosticisme</strong> : positions sur l'existence de Dieu.",
            "<strong>Liberté de conscience</strong> : droit de croire ou de ne pas croire."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Augustin</strong> : foi et raison s'accordent ; croire pour comprendre.",
            "<strong>Descartes</strong> : preuve rationnelle de l'existence de Dieu.",
            "<strong>Kant</strong> : la religion morale postule Dieu, l'immortalité, la liberté (postulats).",
            "<strong>Feuerbach</strong> : Dieu est la projection de l'essence humaine.",
            "<strong>Marx</strong> : la religion est l'opium du peuple.",
            "<strong>Freud</strong> : la religion est une illusion névrotique (père protecteur).",
            "<strong>Weber</strong> : désenchantement du monde ; la modernité écarte le religieux."
        ])) +
        quote("La religion est l'opium du peuple.", "Marx") +
        section("Débats", list_items([
            "Religion et <strong>science</strong> : incompatibles ou complémentaires ?",
            "La religion est-elle nécessaire à la <strong>morale</strong> ?",
            "Peut-on prouver l'existence de Dieu ?",
            "Laïcité et liberté de conscience."
        ])) +
        section("Articulations", list_items([
            "<strong>La raison</strong> : foi et raison.",
            "<strong>La vérité</strong> : révélation vs démonstration.",
            "<strong>La conscience</strong> : liberté de conscience.",
            "<strong>La mort</strong> / <strong>le temps</strong> : espérance d'au-delà."
        ])) +
        section("Sujets possibles", list_items([
            "La religion est-elle nécessaire à la morale ?",
            "Peut-on vivre sans religion ?",
            "La foi est-elle contraire à la raison ?",
            "La religion répond-elle à un besoin humain ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La religion est-elle nécessaire à la morale ?</p>" +
            "<p><strong>I.</strong> La religion a longtemps fondé les valeurs morales.</p>" +
            "<p><strong>II.</strong> Mais Kant montre que la morale peut s'autonomiser de la religion.</p>" +
            "<p><strong>III.</strong> La religion n'est pas nécessaire à la morale, mais peut l'enrichir.</p>")
    },
    {
        "id": "science",
        "title": "La science",
        "perspective": "La connaissance",
        "summary": "Méthode, expérience et vérité : la science explique-t-elle tout ?",
        "html": section("Problématique centrale",
            "<p>La science produit des connaissances objectives par la méthode expérimentale. "
            "Quelle est sa portée ? Peut-elle répondre à toutes les questions humaines ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Science</strong> : ensemble de connaissances systématiques fondées sur l'observation et la raison.",
            "<strong>Hypothèse / théorie / loi</strong> : niveaux d'explication scientifique.",
            "<strong>Science / opinion</strong> : certitude démontrée vs croyance.",
            "<strong>Science exacte / sciences humaines</strong> : physique vs histoire, sociologie."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Descartes</strong> : la science mathématique modèle de toute connaissance.",
            "<strong>Bacon</strong> : connaissance est pouvoir ; méthode expérimentale.",
            "<strong>Popper</strong> : une théorie scientifique doit être réfutable (falsification).",
            "<strong>Kuhn</strong> : révolutions scientifiques ; les paradigmes changent.",
            "<strong>Bachelard</strong> : l'esprit scientifique surmonte les obstacles épistémologiques.",
            "<strong>Comte</strong> : positivisme ; la science remplace la métaphysique et la religion.",
            "<strong>Heidegger</strong> : la science ne pense pas l'être ; elle calcule."
        ])) +
        quote("La science ne pense pas.", "Heidegger") +
        section("Débats", list_items([
            "La science progresse-t-elle vers la <strong>vérité</strong> ?",
            "Science et <strong>éthique</strong> : le « peut-on » dépasse le « savoir ».",
            "La science est-elle <strong>neutre</strong> ou <strong>engagée</strong> ?",
            "Science et <strong>technique</strong> : savoir pour agir."
        ])) +
        section("Articulations", list_items([
            "<strong>La vérité</strong> : critère de la scientificité.",
            "<strong>La technique</strong> : application de la science.",
            "<strong>La raison</strong> : méthode rationnelle.",
            "<strong>La religion</strong> : conflit ou dialogue ?"
        ])) +
        section("Sujets possibles", list_items([
            "La science explique-t-elle tout ?",
            "La science est-elle dangereuse ?",
            "Peut-on croire la science sur parole ?",
            "La science fait-elle le bonheur ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La science explique-t-elle tout ?</p>" +
            "<p><strong>I.</strong> La science explique les phénomènes naturels et sociaux avec une efficacité remarquable.</p>" +
            "<p><strong>II.</strong> Mais elle ne répond pas aux questions de sens, de valeur, d'existence.</p>" +
            "<p><strong>III.</strong> La science explique beaucoup, mais pas tout ; elle a besoin d'autres formes de pensée.</p>")
    },
    {
        "id": "technique",
        "title": "La technique",
        "perspective": "L'existence humaine et la culture",
        "summary": "Outils, machines et progrès : la technique libère-t-elle l'homme ou l'aliène-t-elle ?",
        "html": section("Problématique centrale",
            "<p>La technique est l'ensemble des moyens mis en œuvre pour transformer la nature. "
            "Est-elle neutre, au service de l'homme, ou possède-t-elle une logique propre qui nous échappe ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Technique (techne)</strong> : savoir-faire, art de fabriquer.",
            "<strong>Technique / technologie</strong> : savoir-faire vs application scientifique systématique.",
            "<strong>Technique / science</strong> : science théorique vs application pratique.",
            "<strong>Progrès technique</strong> : amélioration continue des outils et méthodes."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Aristote</strong> : la technique imite la nature.",
            "<strong>Bacon</strong> : la nature ne se laisse vaincre qu'en lui obéissant.",
            "<strong>Marx</strong> : les forces productives (technique) transforment les rapports sociaux.",
            "<strong>Heidegger</strong> : la technique moderne n'est plus un simple outil ; elle enframe (Gestell) le monde.",
            "<strong>Ellul</strong> : la technique est autonome ; elle se développe selon sa propre logique.",
            "<strong>Jonas</strong> : le principe responsabilité face aux techniques destructrices.",
            "<strong>Arendt</strong> : la technique menace la vie active (vita activa)."
        ])) +
        quote("Partout où il y a la technique, il y a le danger.", "Heidegger") +
        section("Débats", list_items([
            "La technique est-elle <strong>neutre</strong> ?",
            "Progrès technique = progrès de l'<strong>humanité</strong> ?",
            "Technique et <strong>liberté</strong> : libération ou aliénation ?",
            "Intelligence artificielle : menace ou opportunité ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La science</strong> : la technique applique le savoir scientifique.",
            "<strong>La nature</strong> : domination ou respect ?",
            "<strong>Le travail</strong> : automatisation et chômage.",
            "<strong>L'art</strong> : technique artistique vs industrialisation."
        ])) +
        section("Sujets possibles", list_items([
            "La technique nous rend-elle libres ?",
            "Peut-on maîtriser la technique ?",
            "Le progrès technique est-il un progrès pour l'humanité ?",
            "La technique est-elle neutre ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La technique nous rend-elle libres ?</p>" +
            "<p><strong>I.</strong> La technique libère de la contrainte naturelle (travail, maladie, distance).</p>" +
            "<p><strong>II.</strong> Mais elle crée de nouvelles dépendances et aliénations (Ellul, Heidegger).</p>" +
            "<p><strong>III.</strong> La technique libère seulement si l'homme en reste le maître conscient.</p>")
    },
    {
        "id": "temps",
        "title": "Le temps",
        "perspective": "L'existence humaine et la culture",
        "summary": "Durée, mémoire et avenir : le temps est-il réel ou une construction de l'esprit ?",
        "html": section("Problématique centrale",
            "<p>Le temps structure notre existence : passé, présent, futur. "
            "Est-il un flux objectif, une illusion, ou le cadre de la conscience ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Temps chronologique</strong> : mesure homogène (heures, secondes).",
            "<strong>Temps vécu (durée)</strong> : expérience subjective (Bergson).",
            "<strong>Temps cyclique / linéaire</strong> : répétition des saisons vs histoire orientée.",
            "<strong>Passé / présent / futur</strong> : dimensions du temps."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Aristote</strong> : le temps est le nombre du mouvement selon l'avant et l'après.",
            "<strong>Augustin</strong> : le temps est dans l'âme ; le présent du passé (mémoire), du présent, du futur (attente).",
            "<strong>Kant</strong> : le temps est une forme a priori de la sensibilité.",
            "<strong>Bergson</strong> : la durée vécue ne se réduit pas à l'espace ni au nombre.",
            "<strong>Heidegger</strong> : l'être-pour-la-mort structure le temps de l'existence (Dasein).",
            "<strong>Einstein</strong> : relativité ; le temps dépend du référentiel (physique).",
            "<strong>Nietzsche</strong> : éternel retour du même."
        ])) +
        quote("Qu'est-ce donc que le temps ? Si personne ne m'interroge, je le sais ; si je veux l'expliquer, je ne le sais plus.", "Augustin") +
        section("Débats", list_items([
            "Le temps est-il <strong>réel</strong> ou <strong>mental</strong> ?",
            "Peut-on changer le <strong>passé</strong> (mémoire, histoire) ?",
            "Le temps est-il <strong>irréversible</strong> ?",
            "Sommes-nous esclaves du temps ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La conscience</strong> : perception du temps.",
            "<strong>L'histoire</strong> : sens du temps collectif.",
            "<strong>La mort</strong> : finitude et urgence de vivre.",
            "<strong>La liberté</strong> : le futur est-il ouvert ?"
        ])) +
        section("Sujets possibles", list_items([
            "Le temps existe-t-il ?",
            "Peut-on maîtriser le temps ?",
            "Le passé peut-il être changé ?",
            "Le temps est-il notre ennemi ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> Le temps existe-t-il ?</p>" +
            "<p><strong>I.</strong> Le temps semble être une réalité objective (physique, histoire).</p>" +
            "<p><strong>II.</strong> Mais il dépend de la conscience (Augustin, Bergson, Kant).</p>" +
            "<p><strong>III.</strong> Le temps existe, mais comme condition de l'expérience humaine, non comme substance absolue.</p>")
    },
    {
        "id": "travail",
        "title": "Le travail",
        "perspective": "L'existence humaine et la culture",
        "summary": "Activité, aliénation et valeur : le travail définit-il l'homme ou l'asservit-il ?",
        "html": section("Problématique centrale",
            "<p>Le travail est l'activité par laquelle l'homme transforme la nature et produit des biens. "
            "Est-il une fatalité, une source de dignité ou une aliénation ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Travail</strong> : activité consciente visant à transformer la matière.",
            "<strong>Travail / loisir</strong> : nécessité vs activité libre.",
            "<strong>Travail / technique</strong> : effort humain vs automatisation.",
            "<strong>Aliénation</strong> (Marx) : le travailleur ne s'approprie pas le produit de son travail."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Aristote</strong> : le loisir (skholè) est supérieur au travail servile.",
            "<strong>Locke</strong> : le travail fonde le droit de propriété.",
            "<strong>Smith</strong> : division du travail accroît la richesse.",
            "<strong>Marx</strong> : le travail aliéné sous le capitalisme ; l'homme se réalise par le travail non aliéné.",
            "<strong>Arendt</strong> : distingue travail (nécessité), œuvre (fabrication), action (politique).",
            "<strong>Weil</strong> : le travail peut dégrader ou élever l'âme.",
            "<strong>Ricœur</strong> : le travail est condition de l'identité et de la reconnaissance."
        ])) +
        quote("Le travail libère l'homme, le travail aliéné l'asservit.", "Marx") +
        section("Débats", list_items([
            "Le travail est-il une <strong>nécessité</strong> ou un <strong>choix</strong> ?",
            "Peut-on être heureux sans travailler ?",
            "Travail et <strong>liberté</strong> : contrainte ou réalisation de soi ?",
            "Fin du travail (automatisation) : utopie ou menace ?"
        ])) +
        section("Articulations", list_items([
            "<strong>La technique</strong> : machines et chômage technologique.",
            "<strong>La liberté</strong> : travail forcé vs travail choisi.",
            "<strong>La justice</strong> : répartition du travail et des richesses.",
            "<strong>Le bonheur</strong> : le travail contribue-t-il au bonheur ?"
        ])) +
        section("Sujets possibles", list_items([
            "Le travail est-il une nécessité ?",
            "Le travail aliène-t-il l'homme ?",
            "Peut-on aimer son travail ?",
            "Faut-il travailler pour être libre ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> Le travail est-il une nécessité ?</p>" +
            "<p><strong>I.</strong> Le travail est nécessaire pour subvenir aux besoins matériels.</p>" +
            "<p><strong>II.</strong> Mais il est aussi activité de création et de reconnaissance sociale.</p>" +
            "<p><strong>III.</strong> Le travail est une nécessité conditionnelle : l'homme pourrait s'en libérer partiellement (technique, loisir).</p>")
    },
    {
        "id": "verite",
        "title": "La vérité",
        "perspective": "La connaissance",
        "summary": "Correspondance, cohérence et révélation : existe-t-il une vérité unique ou des vérités relatives ?",
        "html": section("Problématique centrale",
            "<p>La vérité est l'accord entre une proposition et la réalité. "
            "Mais comment la reconnaître ? Est-elle une, universelle, ou dépend-elle des perspectives ?</p>") +
        section("Définitions et distinctions", list_items([
            "<strong>Vérité</strong> : adaequatio rei et intellectus (accord de l'esprit et de la chose).",
            "<strong>Vérité théorique / pratique</strong> : ce qui est vs ce qui doit être.",
            "<strong>Vérité / opinion / croyance</strong> : certitude démontrée vs jugement incertain.",
            "<strong>Vérité absolue / relative</strong> : universalité vs dépendance au contexte."
        ])) +
        section("Grandes thèses", list_items([
            "<strong>Platon</strong> : la vérité est l'Idée ; l'âme se souvient de la vérité éternelle.",
            "<strong>Descartes</strong> : la vérité claire et distincte est critère de certitude.",
            "<strong>Kant</strong> : vérité transcendantale = accord avec les conditions de la connaissance.",
            "<strong>Nietzsche</strong> : « Il n'y a pas de faits, seulement des interprétations » ; la vérité est une illusion utile.",
            "<strong>Peirce</strong> : la vérité est ce vers quoi tend l'enquête scientifique.",
            "<strong>Heidegger</strong> : l'essence de la vérité est la liberté ; dévoilement de l'être (aletheia).",
            "<strong>Putnam</strong> : vérité interne au langage et aux pratiques."
        ])) +
        quote("Il n'y a pas de faits, il n'y a que des interprétations.", "Nietzsche") +
        section("Débats", list_items([
            "Existe-t-il une <strong>vérité absolue</strong> ?",
            "La <strong>science</strong> approche-t-elle de la vérité ?",
            "Vérité et <strong>mensonge</strong> : le mensonge est-il toujours condamnable ?",
            "Relativisme vs absolutisme."
        ])) +
        section("Articulations", list_items([
            "<strong>La raison</strong> : accès à la vérité.",
            "<strong>La science</strong> : production de vérités objectives.",
            "<strong>Le langage</strong> : dire vrai, dire faux.",
            "<strong>L'art</strong> : vérité esthétique."
        ])) +
        section("Sujets possibles", list_items([
            "La vérité existe-t-elle ?",
            "Peut-on vivre sans vérité ?",
            "La vérité est-elle toujours bonne à dire ?",
            "Y a-t-il plusieurs vérités ?"
        ])) +
        section("Plan type", "<p><strong>Sujet :</strong> La vérité existe-t-elle ?</p>" +
            "<p><strong>I.</strong> L'expérience de la vérité semble fondamentale (évidence, science, justice).</p>" +
            "<p><strong>II.</strong> Mais le scepticisme et le relativisme contestent l'existence d'une vérité unique.</p>" +
            "<p><strong>III.</strong> La vérité existe comme horizon de la pensée, même si son accès est toujours partiel.</p>")
    },
]

METHODOLOGIE = section("L'épreuve de philosophie au baccalauréat",
    "<p><strong>Format :</strong> épreuve écrite de 4 heures, coefficient 8 (voie générale). "
    "Deux exercices au choix : <strong>dissertation</strong> ou <strong>explication de texte</strong>.</p>") + \
section("La dissertation", list_items([
    "<strong>Introduction</strong> : accroche, définition des termes, problématique, annonce du plan.",
    "<strong>Plan dialectique</strong> : thèse (I) → antithèse (II) → dépassement (III).",
    "<strong>Conclusion</strong> : bilan, réponse à la problématique, ouverture.",
    "Mobiliser des <strong>auteurs</strong> et des <strong>exemples</strong> précis à chaque partie.",
    "Éviter le catalogue d'auteurs : chaque référence doit servir l'argument."
])) + \
section("L'explication de texte", list_items([
    "<strong>Introduction</strong> : situer l'auteur, le contexte, annoncer le fil directeur.",
    "<strong>Explication linéaire</strong> : suivre le texte phrase par phrase ou par groupes de phrases.",
    "<strong>Conclusion</strong> : bilan et portée philosophique du texte.",
    "Distinguer <strong>explication</strong> (ce que dit l'auteur) et <strong>discussion</strong> (critique, prolongement)."
])) + \
section("Les trois perspectives du programme", list_items([
    "<strong>L'existence humaine et la culture</strong> : art, bonheur, conscience, nature, religion, technique, temps, travail…",
    "<strong>La morale et la politique</strong> : devoir, État, justice, liberté…",
    "<strong>La connaissance</strong> : langage, raison, science, vérité…"
])) + \
section("Repères philosophiques (à mobiliser)", "<p>Absolu/relatif · Abstrait/concret · En acte/en puissance · Analyse/synthèse · "
    "Concept/intuition · Croyance/savoir · Démonstration/preuve · Expliquer/comprendre · Formel/matériel · "
    "Genre/espèce · Hypothèse/conséquence · Idéal/réel · Identité/égalité/différence · Individuel/collectif · "
    "Intuitif/discursif · Légal/légitime · Médiat/immédiat · Objectif/subjectif · Obligation/contrainte · "
    "Origine/fondement · Persuader/convaincre · Raison/passion · Théorie/pratique · "
    "Universel/général/particulier/singulier · Vrai/probable/certain.</p>")

data = {
    "id": "philo",
    "label": "Philosophie",
    "description": "Parcours pédagogique complet : 17 notions expliquées pas à pas, auteurs détaillés, citations à retenir, plans commentés et méthodologie adaptée.",
    "icon": "psychology",
    "voie": "generale",
    "notionCount": 17,
    "perspectives": PERSPECTIVES,
    "methodologie": {
        "title": "Méthodologie du bac",
        "html": build_methodologie_pedagogical_html(METHODOLOGIE),
    },
    "pedagogie": NEUROPSY_PROFILE,
    "notions": [
        {
            **n,
            "html": build_notion_pedagogical_html(n["id"], n["html"]),
        }
        for n in NOTIONS
    ],
}

out = Path(__file__).resolve().parent.parent / "data" / "cours-philo.json"
out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Written {out} ({len(NOTIONS)} notions)")
