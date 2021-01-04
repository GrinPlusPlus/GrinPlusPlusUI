import React from "react";
import { H3 } from "@blueprintjs/core";

export const HelpComponent = () => {
  return (
    <div>
      <br />
      <H3>Node isn't installed</H3>
      <p>
        This can be easly fixed by making sure our Antivirus is not deleting
        neither putting into quarantine the Backend: GrinNode.exe. In order to
        confirm that, we need to make sure that the file named as GrinNode.exe
        is located inside the bin folder at{" "}
        <code>
          C:\Users\[USERNAME]\AppData\Local\Programs\GrinPlusPlus\resources\app.asar.unpacked\
        </code>
      </p>
      <br />
      <H3>Node isn't running</H3>
      <p>
        This is really uncommon, but it could happen. The first thing we’re
        gonna do is to open a Command Prompt and cd into the{" "}
        <code>
          C:\Users\[USERNAME]\AppData\Local\Programs\GrinPlusPlus\resources\app.asar.unpacked\bin\
        </code>{" "}
        and then run <code>dir GrinNode.exe</code>. Now we just type{" "}
        <code>GrinNode.exe</code> and hit the Enter key. If the previous step
        fails, we should see a message with more information about the issue,
        feel free to Join the Grin++ Telegram Channel and ask for help from
        there, some others users may have faced the same issue as you.
      </p>
      <br />
      <H3>
        The Node process is not running. This is unusual, but don’t worry, you
        just need to restart the wallet
      </H3>
      <p>
        Wow! this should have never happened, it means the Backend suddenly
        stopped, please let us know opening an issue or joining the Grin++
        Telegram Channel.
      </p>
      <br />
      <H3>Stuck on "Waiting for Peers"</H3>
      <p>
        Sometimes this could happen after upgrading Grin++, you could get stuck
        on "Waiting for Peers". In order to fix this, you could try 2 things.
        The first thing you could try is to <b>(Re)Sync</b> the chain by
        clicking on Settings and the on Resync below <b>Node Actions</b>. If the
        solution above doesn’t work you can try this. Close Grin++, go to{" "}
        <code>C:\Users\[USERNAME]\.GrinPP\MAINNET</code>, delete the folder
        called <code>NODE</code>.
      </p>
      <br />
      <H3>The Grin Slatepack address is not being displayed</H3>
      <p>
        This is a pretty annoying issue, I know, but at the same time it’s
        pretty easy to solve. Some people like to run{" "}
        <code>Niffler Wallet</code> or <code>grin-wallet</code> at the same time
        as Grin++, without going deep into this, We will recommend not to do it,
        at least for now, make sure no other grin wallet is running before
        running Grin++. If you are still facing the issue, please, make sure{" "}
        <code>tor.exe</code> is running.
      </p>
      <br />
      <H3>The Address is not green! :(</H3>
      <p>
        This issue happens when <b>Tor</b> is not able to establish connection,
        the first thing you should do is to check if your Firewall is not
        blocking tor connections; after this, your address should be green.
      </p>
      <br />
    </div>
  );
};
