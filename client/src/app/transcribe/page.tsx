"use client";

import { Button } from "@/components/ui/button";
import { useTranscriptionContext } from "@/context";

const highlightText = (unformattedText: string) => {
  // Define the regular expression to match the {...} pattern
  const regexPattern = /{([^}]*)}/g;

  // Replace each match with a span that highlights the text
  const highlightedText = unformattedText.replace(
    regexPattern,
    (match, innerPhrase) =>
      `<span class="bg-red-300 selection:text-red-600">${innerPhrase}</span>`
  );

  return highlightedText;
};

const Page = () => {
  const {
    transcription: { link, text },
  } = useTranscriptionContext();

  return (
    <div className="px-20 pl-36">
      <div className="w-full">
        <div
          contentEditable
          suppressContentEditableWarning={true}
          className="text-slate-700 selection:text-black selection:bg-emerald-200 tespace-pre-wrap outline-none mt-20 max-w-xl text-[1.2vw] font-light leading-loose tracking-tight"
          dangerouslySetInnerHTML={{ __html: highlightText(text || example) }}
        >
          {/* {text || highlightText(example)} */}
        </div>
        <Button className="mt-4">Load more...</Button>
      </div>
    </div>
  );
};
export default Page;

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. \n\n Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const example =
  "Why play Camille top? Well, she has insane engage. She can one shot the enemy backline, she has very high mobility, and she's strong throughout the entire game. However, she can struggle against champions that she doesn't want a hard engage against, and she is reliant on {{Tier-Math}} to wave clear and split push effectively. Camille's passive is periodically her next basic attack against the enemy champion or {{grante}} or shield. This will either block just physical or just magic damage depending on what's best for the situation. Camille's Q has two activations. The first activation is an auto attack reset which grants her next attack bonus range, bonus damage and grants her bonus movement speed. After a very short delay, this ability can be cast again for the same effect. However, if the second activation isn't {{useful one}} and a half seconds, the bonus damage is doubled and dealt as true damage. Camille's W is a cone skill shot during which time she becomes ghosted and enemies hit take damage. If enemies are hit by the outer edge of the cone, they take additional damage, get slowed, and Camille is also healed. Camille's E is her attack on Titan ability. The first activation is a straight line skill shot which fires a grapple in a direction. If this hits {{to range}}, she will then dash to it. Camille can then reactivate the ability to dash in that direction. If this is aimed at an enemy champion, the distance will be doubled. If she hits an enemy champion with this ability she deals damage, knocks them back, stuns them and gains a large amount of bonus attack speed. Camille's ultimate is a pointing click ability which causes her to leap to the enemy champion creating a zone around them. Enemies nearby the target to champion are knocked away. The target cannot escape the zone by any means and while within, Camille's basic attack {{still bonus damage}}. For combos, start with E into a wall and use your W as you go to reactivate your E. This will cause your W to hit them as you land. From here, auto-attack into Q before using your ultimate into another auto-attack into Q. Otherwise, if starting W use W into an auto-attack into Q. From here, use your ultimate into another auto-attack into Q. Using your E to chase down or stun them is needed. For matchups, Camille does great into ranged champions or weaker laners who she can easily engage on whenever she wants. And she can struggle against lane bullies who are happy to fight after she engages. For runes, take this. Grasp gives you everything you want. For build orders, start {{Shurden Pot}}, into tier 2 boots and a Divine Sunderer. After this, arrive {{Hydra and Dede}} are great pickups before finishing a build with any of these as needed. For skill orders, start W then Q then E, before match and Q then E then W taking ult whenever you can. For summoners, spell {{steak teleport}} and ignite. Flash is still fine but she engages so easily that it's off and overkill. Starting the game, your main focus is going to be on farming hard and taking good trades. As the more good trades you take, the easier your farm becomes and the more difficult your opponents becomes. When you have access to all of your abilities, your E is such an amazing engage tool that you can essentially choose to fight whenever you want. So with this massive strength, you want to be looking for the best fights you can take. If you're against a weaker laner, whenever there aren't many minions around to aggro onto you, look through engages. And against stronger laners, wait for them to use or miss an ability before going in. And when going for any trade, you almost always want to have your passive shield up. When you hit level {{section}}, now better it engaging and dealing damage. So any fight that was good before will now be incredible to take. Enter in the mid game, when you have {{tier match}}, your split push is brilliant. Take your tower as soon as possible and keep pushing for pressure. If one champ comes to stop you simply fight and if multiple come you can simply E away. Enter in the mid game team fights you want to flank onto the fight. Wait for the fight to start and with your insane mobility dashes their backline and blow up their carry. It's simply just too difficult to stop you. Keep spamming out damage and jump on your next target.";
