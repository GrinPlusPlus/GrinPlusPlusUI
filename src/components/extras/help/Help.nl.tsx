import React from "react";
import { Button, H3 } from "@blueprintjs/core";

export const HelpComponent = () => {
  return (
    <div>
      <br />
      <H3>De Node is niet beschikbaar</H3>
      <p>
        Dit kan eenvoudig opgelost worden door ervoor te zorgen dat de
        antivirussoftware GrinNode.exe niet wist of in quarantaine plaatst.
        Om dit te bevestigen moet u zeker zijn dat GrinNode.exe in de bin       
        map staat in {" "}
        <code>
          C:\Users\[USERNAME]\AppData\Local\Programs\GrinPlusPlus\resources\app.asar.unpacked\
        </code>
      </p>
      <br />
      <H3>De Node werkt niet</H3>
      <p>
        Dit is ongewoon, maar kan soms voorkomen. Het eerste wat u doet is de
        opdrachtprompt openen, en typ <code>cd</code> in map {" "}
        <code>
          C:\Users\[USERNAME]\AppData\Local\Programs\GrinPlusPlus\resources\app.asar.unpacked\bin\
        </code>{" "}
        en typ dan <code>dir GrinNode.exe</code>. Type daarna {" "}
        <code>GrinNode.exe</code> en de &apos;Enter&apos; toets. Indien de vorige stap
        faalt, zou u meer informatie moeten zien over het probleem. Indien
        u wenst kan u een (Engelstalig) bericht sturen over het probleem
        naar {" "}
        <Button
          icon="help"
          minimal={true}
          onClick={() => {
            require("electron").shell.openExternal("https://t.me/GrinPP");
          }}
        >
          Join the Grin++ Support Channel on Telegram
        </Button>{" "}
        en hier om hulp vragen. Andere Grin++ gebruikers hebben mogelijk hetzelfde
        probleem ondervonden als u.
      </p>
      <br />
      <H3>
        Het Node process werkt niet. Dit is ongewoon, maar geen zorgen, u dient enkel opnieuw
        Grin++ te starten.
      </H3>
      <p>
        Wouw! dit zou nooit mogen gebeuren. Dit betekent dat GrinNode.exe
        plots gestopt is met werken. U kan een &apos;Issue&apos; aanmaken op Github.com
        of dit laten weten in de het Grin++ Telegram Channel.
      </p>
      <br />
      <H3>Blijft hangen op &quot;STATUS: Waiting for Peers&quot;</H3>
      <p>
        Dit kan soms gebeuren na het upgraden van Grin++. Dat je blijft hangen
        op &quot;STATUS: Waiting for Peers&quot;. Om dit op te lossen kan u twee
        dingen doen. Het eerste wat u kan doen is een blockchain <b>(Her)Synchronisatie</b>
        door te klikken op de instellingen en op &quot;Synchronyseren&quot; onderaan bij de <b>Node Acties</b>.
        Als dit niet lukt kan je hetvolgende doen: Sluit Grin++, ga naar map {" "}
        <code>C:\Users\[USERNAME]\.GrinPP\MAINNET</code>, en wis de
        <code>NODE</code> map. En daarna Grin++ terug starten.
      </p>
      <br />
      <H3>Het Grin Slatepack addres wordt niet getoond</H3>
      <p>
        Dit is een vervelende situatie die gemakkelijk kan opgelost worden.
        Sommige mensen gebruiken soms <code>Niffler Wallet</code>
        of <code>grin-wallet</code> tegelijkertijd met Grin++. Wij raden aan
        om dit niet te doen, althans voorlopig niet. Zorg ervoor dat geen enkele
        andere grin wallet actief is voordat u Grin++ start. Indien u nog steeds problemen
        zou ondervinden, vergewis u er dan van of {" "} <code>tor.exe</code> actief is.
      </p>
      <br />
      <H3>Het addres is niet groen! :(</H3>
      <p>
        Dit gebeurt als <b>Tor</b> niet in staat is om een verbinding te maken.
        Het eerste wat u moet doen is controleren of de firewall de tor verbindingen
        niet blokkeert. Daarna zou uw adres groen (en dus bereikbaar) moeten zijn.
      </p>
      <br />
    </div>
  );
};
