import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ConsentWithdrawalSection } from '@/components/datenschutz/ConsentWithdrawalSection'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – Dokum',
}

export default async function DatenschutzPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/" className="mb-8 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900">
        ← Zurück
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-gray-900">Datenschutzerklärung</h1>

      <article className="max-w-none text-gray-600">
        <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">Inhaltsverzeichnis</h2>
        <ul className="space-y-1 mb-8">
          <li><a href="#einleitung-ueberblick" className="text-blue-600 hover:underline">Einleitung und Überblick</a></li>
          <li><a href="#anwendungsbereich" className="text-blue-600 hover:underline">Anwendungsbereich</a></li>
          <li><a href="#rechtsgrundlagen" className="text-blue-600 hover:underline">Rechtsgrundlagen</a></li>
          <li><a href="#kontaktdaten-verantwortliche" className="text-blue-600 hover:underline">Kontaktdaten des Verantwortlichen</a></li>
          <li><a href="#speicherdauer" className="text-blue-600 hover:underline">Speicherdauer</a></li>
          <li><a href="#rechte-dsgvo" className="text-blue-600 hover:underline">Rechte laut Datenschutz-Grundverordnung</a></li>
          <li><a href="#datenuebertragung-drittlaender" className="text-blue-600 hover:underline">Datenübertragung in Drittländer</a></li>
          <li><a href="#sicherheit-datenverarbeitung" className="text-blue-600 hover:underline">Sicherheit der Datenverarbeitung</a></li>
          <li><a href="#kommunikation" className="text-blue-600 hover:underline">Kommunikation</a></li>
          <li><a href="#auftragsverarbeitungsvertrag-avv" className="text-blue-600 hover:underline">Auftragsverarbeitungsvertrag (AVV)</a></li>
          <li><a href="#cookies" className="text-blue-600 hover:underline">Cookies</a></li>
          <li><a href="#webhosting-einleitung" className="text-blue-600 hover:underline">Webhosting Einleitung</a></li>
          <li><a href="#e-mail-marketing-einleitung" className="text-blue-600 hover:underline">E-Mail-Marketing Einleitung</a></li>
        </ul>

        <h2 id="einleitung-ueberblick" className="mb-4 mt-8 text-xl font-bold text-gray-900">Einleitung und Überblick</h2>
        <p>Wir haben diese Datenschutzerklärung (Fassung 12.03.2026-113196099) verfasst, um Ihnen gemäß der Vorgaben der <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE&tid=113196099#d1e2269-1-1" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Datenschutz-Grundverordnung (EU) 2016/679</a> und anwendbaren nationalen Gesetzen zu erklären, welche personenbezogenen Daten (kurz Daten) wir als Verantwortliche &#8211; und die von uns beauftragten Auftragsverarbeiter (z. B. Provider) &#8211; verarbeiten, zukünftig verarbeiten werden und welche rechtmäßigen Möglichkeiten Sie haben. Die verwendeten Begriffe sind geschlechtsneutral zu verstehen.<br/>
<strong>Kurz gesagt:</strong> Wir informieren Sie umfassend über Daten, die wir über Sie verarbeiten.</p>
        <p>Datenschutzerklärungen klingen für gewöhnlich sehr technisch und verwenden juristische Fachbegriffe. Diese Datenschutzerklärung soll Ihnen hingegen die wichtigsten Dinge so einfach und transparent wie möglich beschreiben. Soweit es der Transparenz förderlich ist, werden technische <strong>Begriffe leserfreundlich erklärt</strong>, Links zu weiterführenden Informationen geboten und <strong>Grafiken</strong> zum Einsatz gebracht. Wir informieren damit in klarer und einfacher Sprache, dass wir im Rahmen unserer Geschäftstätigkeiten nur dann personenbezogene Daten verarbeiten, wenn eine entsprechende gesetzliche Grundlage gegeben ist. Das ist sicher nicht möglich, wenn man möglichst knappe, unklare und juristisch-technische Erklärungen abgibt, so wie sie im Internet oft Standard sind, wenn es um Datenschutz geht. Ich hoffe, Sie finden die folgenden Erläuterungen interessant und informativ und vielleicht ist die eine oder andere Information dabei, die Sie noch nicht kannten.<br/>
Wenn trotzdem Fragen bleiben, möchten wir Sie bitten, sich an die unten bzw. im Impressum genannte verantwortliche Stelle zu wenden, den vorhandenen Links zu folgen und sich weitere Informationen auf Drittseiten anzusehen. Unsere Kontaktdaten finden Sie selbstverständlich auch im Impressum.</p>

        <h2 id="anwendungsbereich" className="mb-4 mt-8 text-xl font-bold text-gray-900">Anwendungsbereich</h2>
        <p>Diese Datenschutzerklärung gilt für alle von uns im Unternehmen verarbeiteten personenbezogenen Daten und für alle personenbezogenen Daten, die von uns beauftragte Firmen (Auftragsverarbeiter) verarbeiten. Mit personenbezogenen Daten meinen wir Informationen im Sinne des Art. 4 Nr. 1 DSGVO wie zum Beispiel Name, E-Mail-Adresse und postalische Anschrift einer Person. Die Verarbeitung personenbezogener Daten sorgt dafür, dass wir unsere Dienstleistungen und Produkte anbieten und abrechnen können, sei es online oder offline. Der Anwendungsbereich dieser Datenschutzerklärung umfasst:</p>
        <ul>
          <li>alle Onlineauftritte (Websites, Onlineshops), die wir betreiben</li>
          <li>Social Media Auftritte und E-Mail-Kommunikation</li>
          <li>mobile Apps für Smartphones und andere Geräte</li>
        </ul>
        <p><strong>Kurz gesagt:</strong> Die Datenschutzerklärung gilt für alle Bereiche, in denen personenbezogene Daten im Unternehmen über die genannten Kanäle strukturiert verarbeitet werden. Sollten wir außerhalb dieser Kanäle mit Ihnen in Rechtsbeziehungen eintreten, werden wir Sie gegebenenfalls gesondert informieren.</p>

        <h2 id="rechtsgrundlagen" className="mb-4 mt-8 text-xl font-bold text-gray-900">Rechtsgrundlagen</h2>
        <p>In der folgenden Datenschutzerklärung geben wir Ihnen transparente Informationen zu den rechtlichen Grundsätzen und Vorschriften, also den Rechtsgrundlagen der Datenschutz-Grundverordnung, die uns ermöglichen, personenbezogene Daten zu verarbeiten.<br/>
Was das EU-Recht betrifft, beziehen wir uns auf die VERORDNUNG (EU) 2016/679 DES EUROPÄISCHEN PARLAMENTS UND DES RATES vom 27. April 2016. Diese Datenschutz-Grundverordnung der EU können Sie selbstverständlich online auf EUR-Lex, dem Zugang zum EU-Recht, unter <a href="https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679</a> nachlesen.</p>
        <p>Wir verarbeiten Ihre Daten nur, wenn mindestens eine der folgenden Bedingungen zutrifft:</p>
        <ol>
          <li><strong>Einwilligung</strong> (Artikel 6 Absatz 1 lit. a DSGVO): Sie haben uns Ihre Einwilligung gegeben, Daten zu einem bestimmten Zweck zu verarbeiten. Ein Beispiel wäre die Speicherung Ihrer eingegebenen Daten eines Kontaktformulars.</li>
          <li><strong>Vertrag</strong> (Artikel 6 Absatz 1 lit. b DSGVO): Um einen Vertrag oder vorvertragliche Verpflichtungen mit Ihnen zu erfüllen, verarbeiten wir Ihre Daten. Wenn wir zum Beispiel einen Kaufvertrag mit Ihnen abschließen, benötigen wir vorab personenbezogene Informationen.</li>
          <li><strong>Rechtliche Verpflichtung</strong> (Artikel 6 Absatz 1 lit. c DSGVO): Wenn wir einer rechtlichen Verpflichtung unterliegen, verarbeiten wir Ihre Daten. Zum Beispiel sind wir gesetzlich verpflichtet Rechnungen für die Buchhaltung aufzuheben. Diese enthalten in der Regel personenbezogene Daten.</li>
          <li><strong>Berechtigte Interessen</strong> (Artikel 6 Absatz 1 lit. f DSGVO): Im Falle berechtigter Interessen, die Ihre Grundrechte nicht einschränken, behalten wir uns die Verarbeitung personenbezogener Daten vor. Wir müssen zum Beispiel gewisse Daten verarbeiten, um unsere Website sicher und wirtschaftlich effizient betreiben zu können. Diese Verarbeitung ist somit ein berechtigtes Interesse.</li>
        </ol>
        <p>Weitere Bedingungen wie die Wahrnehmung von Aufnahmen im öffentlichen Interesse und Ausübung öffentlicher Gewalt sowie dem Schutz lebenswichtiger Interessen treten bei uns in der Regel nicht auf. Soweit eine solche Rechtsgrundlage doch einschlägig sein sollte, wird diese an der entsprechenden Stelle ausgewiesen.</p>
        <p>Zusätzlich zu der EU-Verordnung gelten auch noch nationale Gesetze:</p>
        <ul>
          <li>In <strong>Österreich</strong> ist dies das Bundesgesetz zum Schutz natürlicher Personen bei der Verarbeitung personenbezogener Daten (<strong>Datenschutzgesetz</strong>), kurz <strong>DSG</strong>.</li>
          <li>In <strong>Deutschland</strong> gilt das <strong>Bundesdatenschutzgesetz</strong>, kurz<strong> BDSG</strong>.</li>
        </ul>
        <p>Sofern weitere regionale oder nationale Gesetze zur Anwendung kommen, informieren wir Sie in den folgenden Abschnitten darüber.</p>

        <h2 id="kontaktdaten-verantwortliche" className="mb-4 mt-8 text-xl font-bold text-gray-900">Kontaktdaten des Verantwortlichen</h2>
        <p>Sollten Sie Fragen zum Datenschutz oder zur Verarbeitung personenbezogener Daten haben, finden Sie nachfolgend die Kontaktdaten des Verantwortlichen gemäß Artikel 4 Absatz 7 EU-Datenschutz-Grundverordnung (DSGVO):<br/>
Maurice Riegler<br/>
E-Mail: <a href="mailto:mauriceriegler@dokum.at" className="text-blue-600 hover:underline">mauriceriegler@dokum.at</a><br/>
Telefon: <a href="tel:+4367761555976" className="text-blue-600 hover:underline">+4367761555976</a><br/>
Impressum: <a href="https://dokum.at/impressum/" className="text-blue-600 hover:underline">https://dokum.at/impressum/</a></p>

        <h2 id="speicherdauer" className="mb-4 mt-8 text-xl font-bold text-gray-900">Speicherdauer</h2>
        <p>Dass wir personenbezogene Daten nur so lange speichern, wie es für die Bereitstellung unserer Dienstleistungen und Produkte unbedingt notwendig ist, gilt als generelles Kriterium bei uns. Das bedeutet, dass wir personenbezogene Daten löschen, sobald der Grund für die Datenverarbeitung nicht mehr vorhanden ist. In einigen Fällen sind wir gesetzlich dazu verpflichtet, bestimmte Daten auch nach Wegfall des ursprüngliches Zwecks zu speichern, zum Beispiel zu Zwecken der Buchführung.</p>
        <p>Sollten Sie die Löschung Ihrer Daten wünschen oder die Einwilligung zur Datenverarbeitung widerrufen, werden die Daten so rasch wie möglich und soweit keine Pflicht zur Speicherung besteht, gelöscht.</p>
        <p>Über die konkrete Dauer der jeweiligen Datenverarbeitung informieren wir Sie weiter unten, sofern wir weitere Informationen dazu haben.</p>

        <h2 id="rechte-dsgvo" className="mb-4 mt-8 text-xl font-bold text-gray-900">Rechte laut Datenschutz-Grundverordnung</h2>
        <p>Gemäß Artikel 13, 14 DSGVO informieren wir Sie über die folgenden Rechte, die Ihnen zustehen, damit es zu einer fairen und transparenten Verarbeitung von Daten kommt:</p>
        <ul>
          <li>Sie haben laut Artikel 15 DSGVO ein Auskunftsrecht darüber, ob wir Daten von Ihnen verarbeiten. Sollte das zutreffen, haben Sie Recht darauf eine Kopie der Daten zu erhalten und die folgenden Informationen zu erfahren:
            <ul>
              <li>zu welchem Zweck wir die Verarbeitung durchführen;</li>
              <li>die Kategorien, also die Arten von Daten, die verarbeitet werden;</li>
              <li>wer diese Daten erhält und wenn die Daten an Drittländer übermittelt werden, wie die Sicherheit garantiert werden kann;</li>
              <li>wie lange die Daten gespeichert werden;</li>
              <li>das Bestehen des Rechts auf Berichtigung, Löschung oder Einschränkung der Verarbeitung und dem Widerspruchsrecht gegen die Verarbeitung;</li>
              <li>dass Sie sich bei einer Aufsichtsbehörde beschweren können (Links zu diesen Behörden finden Sie weiter unten);</li>
              <li>die Herkunft der Daten, wenn wir sie nicht bei Ihnen erhoben haben;</li>
              <li>ob Profiling durchgeführt wird, ob also Daten automatisch ausgewertet werden, um zu einem persönlichen Profil von Ihnen zu gelangen.</li>
            </ul>
          </li>
          <li>Sie haben laut Artikel 16 DSGVO ein Recht auf Berichtigung der Daten, was bedeutet, dass wir Daten richtig stellen müssen, falls Sie Fehler finden.</li>
          <li>Sie haben laut Artikel 17 DSGVO das Recht auf Löschung („Recht auf Vergessenwerden"), was konkret bedeutet, dass Sie die Löschung Ihrer Daten verlangen dürfen.</li>
          <li>Sie haben laut Artikel 18 DSGVO das Recht auf Einschränkung der Verarbeitung, was bedeutet, dass wir die Daten nur mehr speichern dürfen aber nicht weiter verwenden.</li>
          <li>Sie haben laut Artikel 20 DSGVO das Recht auf Datenübertragbarkeit, was bedeutet, dass wir Ihnen auf Anfrage Ihre Daten in einem gängigen Format zur Verfügung stellen.</li>
          <li>Sie haben laut Artikel 21 DSGVO ein Widerspruchsrecht, welches nach Durchsetzung eine Änderung der Verarbeitung mit sich bringt.
            <ul>
              <li>Wenn die Verarbeitung Ihrer Daten auf Artikel 6 Abs. 1 lit. e (öffentliches Interesse, Ausübung öffentlicher Gewalt) oder Artikel 6 Abs. 1 lit. f (berechtigtes Interesse) basiert, können Sie gegen die Verarbeitung Widerspruch einlegen. Wir prüfen danach so rasch wie möglich, ob wir diesem Widerspruch rechtlich nachkommen können.</li>
              <li>Werden Daten verwendet, um Direktwerbung zu betreiben, können Sie jederzeit gegen diese Art der Datenverarbeitung widersprechen. Wir dürfen Ihre Daten danach nicht mehr für Direktmarketing verwenden.</li>
              <li>Werden Daten verwendet, um Profiling zu betreiben, können Sie jederzeit gegen diese Art der Datenverarbeitung widersprechen. Wir dürfen Ihre Daten danach nicht mehr für Profiling verwenden.</li>
            </ul>
          </li>
          <li>Sie haben laut Artikel 22 DSGVO unter Umständen das Recht, nicht einer ausschließlich auf einer automatisierten Verarbeitung (zum Beispiel Profiling) beruhenden Entscheidung unterworfen zu werden.</li>
          <li>Sie haben laut Artikel 77 DSGVO das Recht auf Beschwerde. Das heißt, Sie können sich jederzeit bei der Datenschutzbehörde beschweren, wenn Sie der Meinung sind, dass die Datenverarbeitung von personenbezogenen Daten gegen die DSGVO verstößt.</li>
        </ul>
        <p><strong>Kurz gesagt:</strong> Sie haben Rechte &#8211; zögern Sie nicht, die oben gelistete verantwortliche Stelle bei uns zu kontaktieren!</p>
        <p>Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche in sonst einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren. Diese ist für Österreich die Datenschutzbehörde, deren Website Sie unter <a href="https://www.dsb.gv.at/?tid=113196099" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://www.dsb.gv.at/</a> finden. In Deutschland gibt es für jedes Bundesland einen Datenschutzbeauftragten. Für nähere Informationen können Sie sich an die <a href="https://www.bfdi.bund.de/DE/Home/home_node.html" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)</a> wenden. Für unser Unternehmen ist die folgende lokale Datenschutzbehörde zuständig:</p>

        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Österreich Datenschutzbehörde</h3>
        <p><strong>Leiter:</strong> Dr. Matthias Schmidl<br/>
<strong>Adresse:</strong> Barichgasse 40-42, 1030 Wien<br/>
<strong>Telefonnr.:</strong> +43 1 52 152-0<br/>
<strong>E-Mail-Adresse:</strong> <a href="mailto:dsb@dsb.gv.at" target="_blank" rel="noopener" className="text-blue-600 hover:underline">dsb@dsb.gv.at</a><br/>
<strong>Website:</strong> <a href="https://www.dsb.gv.at/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://www.dsb.gv.at/</a></p>

        <h2 id="datenuebertragung-drittlaender" className="mb-4 mt-8 text-xl font-bold text-gray-900">Datenübertragung in Drittländer</h2>
        <p>Wir übertragen oder verarbeiten Daten nur dann in Länder außerhalb des Geltungsbereichs der DSGVO (Drittländer), wenn Sie in diese Verarbeitung einwilligen oder eine sonstige gesetzliche Erlaubnis besteht. Dies trifft insbesondere zu, wenn die Verarbeitung gesetzlich vorgeschrieben oder zur Erfüllung eines Vertragsverhältnisses notwendig und in jedem Fall nur soweit dies generell erlaubt ist. Ihre Zustimmung ist in den meisten Fällen der wichtigste Grund, dass wir Daten in Drittländern verarbeiten lassen. Die Verarbeitung personenbezogener Daten in Drittländern wie den USA, wo viele Softwarehersteller Dienstleistungen anbieten und Ihre Serverstandorte haben, kann bedeuten, dass personenbezogene Daten auf unerwartete Weise verarbeitet und gespeichert werden.</p>
        <p>Wir weisen ausdrücklich darauf hin, dass nach Meinung des Europäischen Gerichtshofs derzeit nur dann ein angemessenes Schutzniveau für den Datentransfer in die USA besteht, wenn ein US-Unternehmen, das personenbezogene Daten von EU-Bürgern in den USA verarbeitet, aktiver Teilnehmer des EU-US Data Privacy Frameworks ist. Mehr Informationen dazu finden Sie unter: <a href="https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en</a></p>
        <p>Die Datenverarbeitung durch US-Dienste, die nicht aktive Teilnehmer des EU-US Data Privacy Frameworks sind, kann dazu führen, dass gegebenenfalls Daten nicht anonymisiert verarbeitet und gespeichert werden. Ferner können gegebenenfalls US-amerikanische staatliche Behörden Zugriff auf einzelne Daten nehmen. Zudem kann es vorkommen, dass erhobene Daten mit Daten aus anderen Diensten desselben Anbieters, sofern Sie ein entsprechendes Nutzerkonto haben, verknüpft werden. Nach Möglichkeit versuchen wir Serverstandorte innerhalb der EU zu nutzen, sofern das angeboten wird.<br/>
Wir informieren Sie an den passenden Stellen dieser Datenschutzerklärung genauer über Datenübertragung in Drittländer, sofern diese zutrifft.</p>

        <h2 id="sicherheit-datenverarbeitung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Sicherheit der Datenverarbeitung</h2>
        <p>Um personenbezogene Daten zu schützen, haben wir sowohl technische als auch organisatorische Maßnahmen umgesetzt. Wo es uns möglich ist, verschlüsseln oder pseudonymisieren wir personenbezogene Daten. Dadurch machen wir es im Rahmen unserer Möglichkeiten so schwer wie möglich, dass Dritte aus unseren Daten auf persönliche Informationen schließen können.</p>
        <p>Art. 25 DSGVO spricht hier von &#8220;Datenschutz durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen&#8221; und meint damit, dass man sowohl bei Software (z. B. Formularen) also auch Hardware (z. B. Zugang zum Serverraum) immer an Sicherheit denkt und entsprechende Maßnahmen setzt. Im Folgenden gehen wir, falls erforderlich, noch auf konkrete Maßnahmen ein.</p>

        <h3>TLS-Verschlüsselung mit https</h3>
        <p>TLS, Verschlüsselung und https klingen sehr technisch und sind es auch. Wir verwenden HTTPS (das Hypertext Transfer Protocol Secure steht für „sicheres Hypertext-Übertragungsprotokoll"), um Daten abhörsicher im Internet zu übertragen.<br/>
Das bedeutet, dass die komplette Übertragung aller Daten von Ihrem Browser zu unserem Webserver abgesichert ist &#8211; niemand kann &#8220;mithören&#8221;.</p>
        <p>Damit haben wir eine zusätzliche Sicherheitsschicht eingeführt und erfüllen den Datenschutz durch Technikgestaltung (<a href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE&tid=113196099" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Artikel 25 Absatz 1 DSGVO</a>). Durch den Einsatz von TLS (Transport Layer Security), einem Verschlüsselungsprotokoll zur sicheren Datenübertragung im Internet, können wir den Schutz vertraulicher Daten sicherstellen.<br/>
Sie erkennen die Benutzung dieser Absicherung der Datenübertragung am kleinen Schlosssymbol links oben im Browser, links von der Internetadresse (z. B. beispielseite.de) und der Verwendung des Schemas https (anstatt http) als Teil unserer Internetadresse.<br/>
Wenn Sie mehr zum Thema Verschlüsselung wissen möchten, empfehlen wir die Google Suche nach &#8220;Hypertext Transfer Protocol Secure wiki&#8221; um gute Links zu weiterführenden Informationen zu erhalten.</p>

        <h2 id="kommunikation" className="mb-4 mt-8 text-xl font-bold text-gray-900">Kommunikation</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">Kommunikation Zusammenfassung</p>
          <p>👥 Betroffene: Alle, die mit uns per Telefon, E-Mail oder Online-Formular kommunizieren<br/>
📝 Verarbeitete Daten: z. B. Telefonnummer, Name, E-Mail-Adresse, eingegebene Formulardaten. Mehr Details dazu finden Sie bei der jeweils eingesetzten Kontaktart<br/>
🤝 Zweck: Abwicklung der Kommunikation mit Kunden, Geschäftspartnern usw.<br/>
📅 Speicherdauer: Dauer des Geschäftsfalls und der gesetzlichen Vorschriften<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. b DSGVO (Vertrag), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</p>
        </div>
        <p>Wenn Sie mit uns Kontakt aufnehmen und per Telefon, E-Mail oder Online-Formular kommunizieren, kann es zur Verarbeitung personenbezogener Daten kommen.</p>
        <p>Die Daten werden für die Abwicklung und Bearbeitung Ihrer Frage und des damit zusammenhängenden Geschäftsvorgangs verarbeitet. Die Daten während eben solange gespeichert bzw. solange es das Gesetz vorschreibt.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Betroffene Personen</h3>
        <p>Von den genannten Vorgängen sind alle betroffen, die über die von uns bereit gestellten Kommunikationswege den Kontakt zu uns suchen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Telefon</h3>
        <p>Wenn Sie uns anrufen, werden die Anrufdaten auf dem jeweiligen Endgerät und beim eingesetzten Telekommunikationsanbieter pseudonymisiert gespeichert. Außerdem können Daten wie Name und Telefonnummer im Anschluss per E-Mail versendet und zur Anfragebeantwortung gespeichert werden. Die Daten werden gelöscht, sobald der Geschäftsfall beendet wurde und es gesetzliche Vorgaben erlauben.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">E-Mail</h3>
        <p>Wenn Sie mit uns per E-Mail kommunizieren, werden Daten gegebenenfalls auf dem jeweiligen Endgerät (Computer, Laptop, Smartphone,…) gespeichert und es kommt zur Speicherung von Daten auf dem E-Mail-Server. Die Daten werden gelöscht, sobald der Geschäftsfall beendet wurde und es gesetzliche Vorgaben erlauben.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Online Formulare</h3>
        <p>Wenn Sie mit uns mittels Online-Formular kommunizieren, werden Daten auf unserem Webserver gespeichert und gegebenenfalls an eine E-Mail-Adresse von uns weitergeleitet. Die Daten werden gelöscht, sobald der Geschäftsfall beendet wurde und es gesetzliche Vorgaben erlauben.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlagen</h3>
        <p>Die Verarbeitung der Daten basiert auf den folgenden Rechtsgrundlagen:</p>
        <ul>
          <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung): Sie geben uns die Einwilligung Ihre Daten zu speichern und weiter für den Geschäftsfall betreffende Zwecke zu verwenden;</li>
          <li>Art. 6 Abs. 1 lit. b DSGVO (Vertrag): Es besteht die Notwendigkeit für die Erfüllung eines Vertrags mit Ihnen oder einem Auftragsverarbeiter wie z. B. dem Telefonanbieter oder wir müssen die Daten für vorvertragliche Tätigkeiten, wie z. B. die Vorbereitung eines Angebots, verarbeiten;</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen): Wir wollen Kundenanfragen und geschäftliche Kommunikation in einem professionellen Rahmen betreiben. Dazu sind gewisse technische Einrichtungen wie z. B. E-Mail-Programme, Exchange-Server und Mobilfunkbetreiber notwendig, um die Kommunikation effizient betreiben zu können.</li>
        </ul>

        <h2 id="auftragsverarbeitungsvertrag-avv" className="mb-4 mt-8 text-xl font-bold text-gray-900">Auftragsverarbeitungsvertrag (AVV)</h2>
        <p>In diesem Abschnitt möchten wir Ihnen erklären, was ein Auftragsverarbeitungsvertrag ist und warum dieser benötigt wird. Weil das Wort &#8220;Auftragsverarbeitungsvertrag&#8221; ein ziemlicher Zungenbrecher ist, werden wir hier im Text auch öfters nur das Akronym AVV benutzen. Wie die meisten Unternehmen arbeiten wir nicht alleine, sondern nehmen auch selbst Dienstleistungen anderer Unternehmen oder Einzelpersonen in Anspruch. Durch die Einbeziehung verschiedener Unternehmen bzw. Dienstleister kann es sein, dass wir personenbezogene Daten zur Verarbeitung weitergeben. Diese Partner fungieren dann als Auftragsverarbeiter, mit denen wir einen Vertrag, den sogenannten Auftragsverarbeitungsvertrag (AVV), abschließen. Für Sie am wichtigsten zu wissen ist, dass die Verarbeitung Ihrer personenbezogenen Daten ausschließlich nach unserer Weisung erfolgt und durch den AVV geregelt werden muss.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Wer sind Auftragsverarbeiter?</h3>
        <p>Wir sind als Unternehmen und Websiteinhaber für alle Daten, die wir von Ihnen verarbeiten verantwortlich. Neben den Verantwortlichen kann es auch sogenannte Auftragsverarbeiter geben. Dazu zählt jedes Unternehmen bzw. jede Person, die in unserem Auftrag personenbezogene Daten verarbeitet. Genauer und nach der DSGVO-Definition gesagt: jede natürliche oder juristische Person, Behörde, Einrichtung oder eine andere Stelle, die in unserem Auftrag personenbezogene Daten verarbeitet, gilt als Auftragsverarbeiter. Auftragsverarbeiter können folglich Dienstleister wie Hosting- oder Cloudanbieter, Bezahlungs- oder Newsletter-Anbieter oder große Unternehmen wie beispielsweise Google oder Microsoft sein.</p>
        <p>Zur besseren Verständlichkeit der Begrifflichkeiten hier ein Überblick über die drei Rollen in der DSGVO:</p>
        <p><strong>Betroffener</strong> (Sie als Kunde oder Interessent) → <strong>Verantwortlicher</strong> (wir als Unternehmen und Auftraggeber) → <strong>Auftragsverarbeiter</strong> (Dienstleister wie z. B. Webhoster oder Cloudanbieter)</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Inhalt eines Auftragsverarbeitungsvertrages</h3>
        <p>Wie bereits oben erwähnt, haben wir mit unseren Partnern, die als Auftragsverarbeiter fungieren, einen AVV abgeschlossen. Darin wird allen voran festgehalten, dass der Auftragsverarbeiter die zu bearbeitenden Daten ausschließlich gemäß der DSGVO verarbeitet. Der Vertrag muss schriftlich abgeschlossen werden, allerdings gilt in diesem Zusammenhang auch der elektronische Vertragsabschluss als „schriftlich". Erst auf der Grundlage des Vertrags erfolgt die Verarbeitung der personenbezogenen Daten. Im Vertrag muss folgendes enthalten sein:</p>
        <ul>
          <li>Bindung an uns als Verantwortlichen</li>
          <li>Pflichten und Rechte des Verantwortlichen</li>
          <li>Kategorien betroffener Personen</li>
          <li>Art der personenbezogenen Daten</li>
          <li>Art und Zweck der Datenverarbeitung</li>
          <li>Gegenstand und Dauer der Datenverarbeitung</li>
          <li>Durchführungsort der Datenverarbeitung</li>
        </ul>
        <p>Weiters enthält der Vertrag alle Pflichten des Auftragsverarbeiters. Die wichtigsten Pflichten sind:</p>
        <ul>
          <li>Maßnahmen zur Datensicherheit zu gewährleisten</li>
          <li>mögliche technische und organisatorischen Maßnahmen zu treffen, um die Rechte der betroffenen Person zu schützen</li>
          <li>ein Daten-Verarbeitungsverzeichnis zu führen</li>
          <li>auf Anfrage der Datenschutz-Aufsichtsbehörde mit dieser zusammenzuarbeiten</li>
          <li>eine Risikoanalyse in Bezug auf die erhaltenen personenbezogenen Daten durchzuführen</li>
          <li>Sub-Auftragsverarbeiter dürfen nur mit schriftlicher Genehmigung des Verantwortlichen beauftragt werden</li>
        </ul>
        <p>Wie so eine AVV konkret aussieht, können Sie sich beispielsweise unter <a href="https://www.wko.at/service/wirtschaftsrecht-gewerberecht/eu-dsgvo-mustervertrag-auftragsverarbeitung.html" className="text-blue-600 hover:underline">https://www.wko.at/service/wirtschaftsrecht-gewerberecht/eu-dsgvo-mustervertrag-auftragsverarbeitung.html</a> ansehen. Hier wird ein Mustervertrag vorgestellt.</p>

        <h2 id="cookies" className="mb-4 mt-8 text-xl font-bold text-gray-900">Cookies</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">Cookies Zusammenfassung</p>
          <p>👥 Betroffene: Besucher der Website<br/>
🤝 Zweck: abhängig vom jeweiligen Cookie. Mehr Details dazu finden Sie weiter unten bzw. beim Hersteller der Software, der das Cookie setzt.<br/>
📝 Verarbeitete Daten: Abhängig vom jeweils eingesetzten Cookie. Mehr Details dazu finden Sie weiter unten bzw. beim Hersteller der Software, der das Cookie setzt.<br/>
📅 Speicherdauer: abhängig vom jeweiligen Cookie, kann von Stunden bis hin zu Jahren variieren<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit.f DSGVO (Berechtigte Interessen)</p>
        </div>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was sind Cookies?</h3>
        <p>Unsere Website verwendet HTTP-Cookies, um nutzerspezifische Daten zu speichern.<br/>
Im Folgenden erklären wir, was Cookies sind und warum Sie genutzt werden, damit Sie die folgende Datenschutzerklärung besser verstehen.</p>
        <p>Immer wenn Sie durch das Internet surfen, verwenden Sie einen Browser. Bekannte Browser sind beispielsweise Chrome, Safari, Firefox, Internet Explorer und Microsoft Edge. Die meisten Websites speichern kleine Text-Dateien in Ihrem Browser. Diese Dateien nennt man Cookies.</p>
        <p>Eines ist nicht von der Hand zu weisen: Cookies sind echt nützliche Helferlein. Fast alle Websites verwenden Cookies. Genauer gesprochen sind es HTTP-Cookies, da es auch noch andere Cookies für andere Anwendungsbereiche gibt. HTTP-Cookies sind kleine Dateien, die von unserer Website auf Ihrem Computer gespeichert werden. Diese Cookie-Dateien werden automatisch im Cookie-Ordner, quasi dem &#8220;Hirn&#8221; Ihres Browsers, untergebracht. Ein Cookie besteht aus einem Namen und einem Wert. Bei der Definition eines Cookies müssen zusätzlich ein oder mehrere Attribute angegeben werden.</p>
        <p>Cookies speichern gewisse Nutzerdaten von Ihnen, wie beispielsweise Sprache oder persönliche Seiteneinstellungen. Wenn Sie unsere Seite wieder aufrufen, übermittelt Ihr Browser die „userbezogenen" Informationen an unsere Seite zurück. Dank der Cookies weiß unsere Website, wer Sie sind und bietet Ihnen die Einstellung, die Sie gewohnt sind. In einigen Browsern hat jedes Cookie eine eigene Datei, in anderen wie beispielsweise Firefox sind alle Cookies in einer einzigen Datei gespeichert.</p>
        <p>Es gibt sowohl Erstanbieter Cookies als auch Drittanbieter-Cookies. Erstanbieter-Cookies werden direkt von unserer Seite erstellt, Drittanbieter-Cookies werden von Partner-Websites (z.B. Google Analytics) erstellt. Jedes Cookie ist individuell zu bewerten, da jedes Cookie andere Daten speichert. Auch die Ablaufzeit eines Cookies variiert von ein paar Minuten bis hin zu ein paar Jahren. Cookies sind keine Software-Programme und enthalten keine Viren, Trojaner oder andere „Schädlinge". Cookies können auch nicht auf Informationen Ihres PCs zugreifen.</p>
        <p>So können zum Beispiel Cookie-Daten aussehen:</p>
        <p><strong>Name:</strong> _ga<br/>
<strong>Wert:</strong> GA1.2.1326744211.152113196099-9<br/>
<strong>Verwendungszweck:</strong> Unterscheidung der Websitebesucher<br/>
<strong>Ablaufdatum:</strong> nach 2 Jahren</p>
        <p>Diese Mindestgrößen sollte ein Browser unterstützen können:</p>
        <ul>
          <li>Mindestens 4096 Bytes pro Cookie</li>
          <li>Mindestens 50 Cookies pro Domain</li>
          <li>Mindestens 3000 Cookies insgesamt</li>
        </ul>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Arten von Cookies gibt es?</h3>
        <p>Die Frage welche Cookies wir im Speziellen verwenden, hängt von den verwendeten Diensten ab und wird in den folgenden Abschnitten der Datenschutzerklärung geklärt. An dieser Stelle möchten wir kurz auf die verschiedenen Arten von HTTP-Cookies eingehen.</p>
        <p>Man kann 4 Arten von Cookies unterscheiden:</p>
        <p><strong>Unerlässliche Cookies</strong><br/>
Diese Cookies sind nötig, um grundlegende Funktionen der Website sicherzustellen. Zum Beispiel braucht es diese Cookies, wenn ein User ein Produkt in den Warenkorb legt, dann auf anderen Seiten weitersurft und später erst zur Kasse geht. Durch diese Cookies wird der Warenkorb nicht gelöscht, selbst wenn der User sein Browserfenster schließt.</p>
        <p><strong>Zweckmäßige Cookies</strong><br/>
Diese Cookies sammeln Infos über das Userverhalten und ob der User etwaige Fehlermeldungen bekommt. Zudem werden mithilfe dieser Cookies auch die Ladezeit und das Verhalten der Website bei verschiedenen Browsern gemessen.</p>
        <p><strong>Zielorientierte Cookies</strong><br/>
Diese Cookies sorgen für eine bessere Nutzerfreundlichkeit. Beispielsweise werden eingegebene Standorte, Schriftgrößen oder Formulardaten gespeichert.</p>
        <p><strong>Werbe-Cookies</strong><br/>
Diese Cookies werden auch Targeting-Cookies genannt. Sie dienen dazu dem User individuell angepasste Werbung zu liefern. Das kann sehr praktisch, aber auch sehr nervig sein.</p>
        <p>Üblicherweise werden Sie beim erstmaligen Besuch einer Website gefragt, welche dieser Cookiearten Sie zulassen möchten. Und natürlich wird diese Entscheidung auch in einem Cookie gespeichert.</p>
        <p>Wenn Sie mehr über Cookies wissen möchten und technische Dokumentationen nicht scheuen, empfehlen wir <a href="https://datatracker.ietf.org/doc/html/rfc6265" className="text-blue-600 hover:underline">https://datatracker.ietf.org/doc/html/rfc6265</a>, dem Request for Comments der Internet Engineering Task Force (IETF) namens &#8220;HTTP State Management Mechanism&#8221;.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Zweck der Verarbeitung über Cookies</h3>
        <p>Der Zweck ist letztendlich abhängig vom jeweiligen Cookie. Mehr Details dazu finden Sie weiter unten bzw. beim Hersteller der Software, die das Cookie setzt.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Daten werden verarbeitet?</h3>
        <p>Cookies sind kleine Gehilfen für viele verschiedene Aufgaben. Welche Daten in Cookies gespeichert werden, kann man leider nicht verallgemeinern, aber wir werden Sie im Rahmen der folgenden Datenschutzerklärung über die verarbeiteten bzw. gespeicherten Daten informieren.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Speicherdauer von Cookies</h3>
        <p>Die Speicherdauer hängt vom jeweiligen Cookie ab und wird weiter unter präzisiert. Manche Cookies werden nach weniger als einer Stunde gelöscht, andere können mehrere Jahre auf einem Computer gespeichert bleiben.</p>
        <p>Sie haben außerdem selbst Einfluss auf die Speicherdauer. Sie können über ihren Browser sämtliche Cookies jederzeit manuell löschen (siehe auch unten &#8220;Widerspruchsrecht&#8221;). Ferner werden Cookies, die auf einer Einwilligung beruhen, spätestens nach Widerruf Ihrer Einwilligung gelöscht, wobei die Rechtmäßigkeit der Speicherung bis dahin unberührt bleibt.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Widerspruchsrecht &#8211; wie kann ich Cookies löschen?</h3>
        <p>Wie und ob Sie Cookies verwenden wollen, entscheiden Sie selbst. Unabhängig von welchem Service oder welcher Website die Cookies stammen, haben Sie immer die Möglichkeit Cookies zu löschen, zu deaktivieren oder nur teilweise zuzulassen. Zum Beispiel können Sie Cookies von Drittanbietern blockieren, aber alle anderen Cookies zulassen.</p>
        <p>Wenn Sie feststellen möchten, welche Cookies in Ihrem Browser gespeichert wurden, wenn Sie Cookie-Einstellungen ändern oder löschen wollen, können Sie dies in Ihren Browser-Einstellungen finden:</p>
        <p><a href="https://support.google.com/chrome/answer/95647?tid=113196099" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Chrome: Cookies in Chrome löschen, aktivieren und verwalten</a></p>
        <p><a href="https://support.apple.com/de-at/guide/safari/sfri11471/mac?tid=113196099" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari: Verwalten von Cookies und Websitedaten mit Safari</a></p>
        <p><a href="https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen?tid=113196099" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firefox: Cookies löschen, um Daten zu entfernen, die Websites auf Ihrem Computer abgelegt haben</a></p>
        <p><a href="https://support.microsoft.com/de-de/windows/l%C3%B6schen-und-verwalten-von-cookies-168dab11-0753-043d-7c16-ede5947fc64d?tid=113196099" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Internet Explorer: Löschen und Verwalten von Cookies</a></p>
        <p><a href="https://support.microsoft.com/de-de/microsoft-edge/cookies-in-microsoft-edge-l%C3%B6schen-63947406-40ac-c3b8-57b9-2a946a29ae09?tid=113196099" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge: Löschen und Verwalten von Cookies</a></p>
        <p>Falls Sie grundsätzlich keine Cookies haben wollen, können Sie Ihren Browser so einrichten, dass er Sie immer informiert, wenn ein Cookie gesetzt werden soll. So können Sie bei jedem einzelnen Cookie entscheiden, ob Sie das Cookie erlauben oder nicht. Die Vorgangsweise ist je nach Browser verschieden. Am besten Sie suchen die Anleitung in Google mit dem Suchbegriff "Cookies löschen Chrome" oder &#8220;Cookies deaktivieren Chrome&#8221; im Falle eines Chrome Browsers.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlage</h3>
        <p>Seit 2009 gibt es die sogenannten „Cookie-Richtlinien". Darin ist festgehalten, dass das Speichern von Cookies eine <strong>Einwilligung</strong> (Artikel 6 Abs. 1 lit. a DSGVO) von Ihnen verlangt. Innerhalb der EU-Länder gibt es allerdings noch sehr unterschiedliche Reaktionen auf diese Richtlinien. In Österreich erfolgte aber die Umsetzung dieser Richtlinie in § 165 Abs. 3 des Telekommunikationsgesetzes (2021). In Deutschland wurden die Cookie-Richtlinien nicht als nationales Recht umgesetzt. Stattdessen erfolgte die Umsetzung dieser Richtlinie weitgehend in § 15 Abs. 3 des Telemediengesetzes (TMG), welches seit Mai 2024 durch das Digitale-Dienste-Gesetz (DDG) ersetzt wurde.</p>
        <p>Für unbedingt notwendige Cookies, auch soweit keine Einwilligung vorliegt, bestehen <strong>berechtigte Interessen</strong> (Artikel 6 Abs. 1 lit. f DSGVO), die in den meisten Fällen wirtschaftlicher Natur sind. Wir möchten den Besuchern der Website eine angenehme Benutzererfahrung bescheren und dafür sind bestimmte Cookies oft unbedingt notwendig.</p>
        <p>Soweit nicht unbedingt erforderliche Cookies zum Einsatz kommen, geschieht dies nur im Falle Ihrer Einwilligung. Rechtsgrundlage ist insoweit Art. 6 Abs. 1 lit. a DSGVO.</p>
        <p>In den folgenden Abschnitten werden Sie genauer über den Einsatz von Cookies informiert, sofern eingesetzte Software Cookies verwendet.</p>

        <h2 id="webhosting-einleitung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Webhosting Einleitung</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">Webhosting Zusammenfassung</p>
          <p>👥 Betroffene: Besucher der Website<br/>
🤝 Zweck: professionelles Hosting der Website und Absicherung des Betriebs<br/>
📝 Verarbeitete Daten: IP-Adresse, Zeitpunkt des Websitebesuchs, verwendeter Browser und weitere Daten. Mehr Details dazu finden Sie weiter unten bzw. beim jeweils eingesetzten Webhosting Provider.<br/>
📅 Speicherdauer: abhängig vom jeweiligen Provider, aber in der Regel 2 Wochen<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit.f DSGVO (Berechtigte Interessen)</p>
        </div>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was ist Webhosting?</h3>
        <p>Wenn Sie heutzutage Websites besuchen, werden gewisse Informationen &#8211; auch personenbezogene Daten &#8211; automatisch erstellt und gespeichert, so auch auf dieser Website. Diese Daten sollten möglichst sparsam und nur mit Begründung verarbeitet werden. Mit Website meinen wir übrigens die Gesamtheit aller Webseiten auf einer Domain, d.h. alles von der Startseite (Homepage) bis hin zur aller letzten Unterseite (wie dieser hier). Mit Domain meinen wir zum Beispiel beispiel.de oder musterbeispiel.com.</p>
        <p>Wenn Sie eine Website auf einem Computer, Tablet oder Smartphone ansehen möchten, verwenden Sie dafür ein Programm, das sich Webbrowser nennt. Sie kennen vermutlich einige Webbrowser beim Namen: Google Chrome, Microsoft Edge, Mozilla Firefox und Apple Safari. Wir sagen kurz Browser oder Webbrowser dazu.</p>
        <p>Um die Website anzuzeigen, muss sich der Browser zu einem anderen Computer verbinden, wo der Code der Website gespeichert ist: dem Webserver. Der Betrieb eines Webservers ist eine komplizierte und aufwendige Aufgabe, weswegen dies in der Regel von professionellen Anbietern, den Providern, übernommen wird. Diese bieten Webhosting an und sorgen damit für eine verlässliche und fehlerfreie Speicherung der Daten von Websites. Eine ganze Menge Fachbegriffe, aber bitte bleiben Sie dran, es wird noch besser!</p>
        <p>Bei der Verbindungsaufnahme des Browsers auf Ihrem Computer (Desktop, Laptop, Tablet oder Smartphone) und während der Datenübertragung zu und vom Webserver kann es zu einer Verarbeitung personenbezogener Daten kommen. Einerseits speichert Ihr Computer Daten, andererseits muss auch der Webserver Daten eine Zeit lang speichern, um einen ordentlichen Betrieb zu gewährleisten.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Warum verarbeiten wir personenbezogene Daten?</h3>
        <p>Die Zwecke der Datenverarbeitung sind:</p>
        <ol>
          <li>Professionelles Hosting der Website und Absicherung des Betriebs</li>
          <li>zur Aufrechterhaltung der Betriebs- und IT-Sicherheit</li>
          <li>Anonyme Auswertung des Zugriffsverhaltens zur Verbesserung unseres Angebots und ggf. zur Strafverfolgung bzw. Verfolgung von Ansprüchen</li>
        </ol>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Daten werden verarbeitet?</h3>
        <p>Auch während Sie unsere Website jetzt gerade besuchen, speichert unser Webserver, das ist der Computer auf dem diese Webseite gespeichert ist, in der Regel automatisch Daten wie</p>
        <ul>
          <li>die komplette Internetadresse (URL) der aufgerufenen Webseite</li>
          <li>Browser und Browserversion (z. B. Chrome 87)</li>
          <li>das verwendete Betriebssystem (z. B. Windows 10)</li>
          <li>die Adresse (URL) der zuvor besuchten Seite (Referrer URL) (z. B. <a href="https://www.beispielquellsite.de/vondabinichgekommen/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://www.beispielquellsite.de/vondabinichgekommen/</a>)</li>
          <li>den Hostnamen und die IP-Adresse des Geräts von welchem aus zugegriffen wird (z. B. COMPUTERNAME und 194.23.43.121)</li>
          <li>Datum und Uhrzeit</li>
          <li>in Dateien, den sogenannten Webserver-Logfiles</li>
        </ul>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Wie lange werden Daten gespeichert?</h3>
        <p>In der Regel werden die oben genannten Daten zwei Wochen gespeichert und danach automatisch gelöscht. Wir geben diese Daten nicht weiter, können jedoch nicht ausschließen, dass diese Daten beim Vorliegen von rechtswidrigem Verhalten von Behörden eingesehen werden.</p>
        <p><strong>Kurz gesagt:</strong> Ihr Besuch wird durch unseren Provider (Firma, die unsere Website auf speziellen Computern (Servern) laufen lässt), protokolliert, aber wir geben Ihre Daten nicht ohne Zustimmung weiter!</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlage</h3>
        <p>Die Rechtmäßigkeit der Verarbeitung personenbezogener Daten im Rahmen des Webhosting ergibt sich aus Art. 6 Abs. 1 lit. f DSGVO (Wahrung der berechtigten Interessen), denn die Nutzung von professionellem Hosting bei einem Provider ist notwendig, um das Unternehmen im Internet sicher und nutzerfreundlich präsentieren und Angriffe und Forderungen hieraus gegebenenfalls verfolgen zu können.</p>
        <p>Zwischen uns und dem Hosting-Provider besteht in der Regel ein Vertrag über die Auftragsverarbeitung gemäß Art. 28 f. DSGVO, der die Einhaltung von Datenschutz gewährleistet und Datensicherheit garantiert.</p>

        <h2 id="e-mail-marketing-einleitung" className="mb-4 mt-8 text-xl font-bold text-gray-900">E-Mail-Marketing Einleitung</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">E-Mail-Marketing Zusammenfassung</p>
          <p>👥 Betroffene: Newsletter-Abonnenten<br/>
🤝 Zweck: Direktwerbung per E-Mail, Benachrichtigung über systemrelevante Ereignisse<br/>
📝 Verarbeitete Daten: Eingegebene Daten bei der Registrierung jedoch mindestens die E-Mail-Adresse. Mehr Details dazu finden Sie beim jeweils eingesetzten E-Mail-Marketing-Tool.<br/>
📅 Speicherdauer: Dauer des Bestehens des Abonnements<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)</p>
        </div>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was ist E-Mail-Marketing?</h3>
        <p>Um Sie stets auf dem Laufenden zu halten, nutzen wir auch die Möglichkeit des E-Mail-Marketings. Dabei werden, sofern Sie dem Empfang unserer E-Mails bzw. Newsletter zugestimmt haben, auch Daten von Ihnen verarbeitet und gespeichert. E-Mail-Marketing ist ein Teilbereich des Online-Marketings. Dabei werden Neuigkeiten oder allgemeine Informationen über ein Unternehmen, Produkte oder Dienstleistungen per E-Mail an eine bestimmte Gruppe an Menschen, die sich dafür interessieren, gesendet.</p>
        <p>Wenn Sie an unserem E-Mail-Marketing (meist per Newsletter) teilnehmen wollen, müssen Sie sich im Normalfall einfach nur mit Ihrer E-Mail-Adresse anmelden. Dafür füllen Sie ein Online-Formular aus und senden es ab. Es kann aber auch vorkommen, dass wir Sie etwa um Ihre Anrede und Ihren Namen bitten, damit wir Sie auch persönlich anschreiben können.</p>
        <p>Grundsätzlich funktioniert das Anmelden zu Newslettern mit Hilfe des sogenannten „Double-Opt-In-Verfahrens". Nachdem Sie sich für unseren Newsletter auf unserer Website angemeldet haben, bekommen Sie eine E-Mail, über die Sie die Newsletter-Anmeldung bestätigen. So wird sichergestellt, dass Ihnen die E-Mail-Adresse gehört und sich niemand mit einer fremden E-Mail-Adresse angemeldet hat. Wir oder ein von uns verwendetes Benachrichtigungs-Tool protokolliert jede einzelne Anmeldung. Dies ist nötig, damit wir den rechtlich korrekten Anmeldevorgang auch nachweisen können. Dabei wird in der Regel der Zeitpunkt der Anmeldung, der Zeitpunkt der Anmeldebestätigung und Ihre IP-Adresse gespeichert. Zusätzlich wird auch protokolliert, wenn Sie Änderungen Ihrer gespeicherten Daten vornehmen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Warum nutzen wir E-Mail-Marketing?</h3>
        <p>Wir wollen natürlich mit Ihnen in Kontakt bleiben und Ihnen stets die wichtigsten Neuigkeiten über unser Unternehmen präsentieren. Dafür nutzen wir unter anderem E-Mail-Marketing &#8211; oft auch nur &#8220;Newsletter&#8221; bezeichnet &#8211; als wesentlichen Bestandteil unseres Online-Marketings. Sofern Sie sich damit einverstanden erklären oder es gesetzlich erlaubt ist, schicken wir Ihnen Newsletter, System-E-Mails oder andere Benachrichtigungen per E-Mail. Wenn wir im folgenden Text den Begriff „Newsletter" verwenden, meinen wir damit hauptsächlich regelmäßig versandte E-Mails. Natürlich wollen wir Sie mit unseren Newsletter in keiner Weise belästigen. Darum sind wir wirklich stets bemüht, nur relevante und interessante Inhalte zu bieten. So erfahren Sie etwa mehr über unser Unternehmen, unsere Leistungen oder Produkte. Da wir unsere Angebote auch immer verbessern, erfahren Sie über unseren Newsletter auch immer, wenn es Neuigkeiten gibt oder wir gerade spezielle, lukrative Aktionen anbieten. Sofern wir einen Dienstleister, der ein professionelles Versand-Tool anbietet, für unser E-Mail-Marketing beauftragen, machen wir das, um Ihnen schnelle und sichere Newsletter bieten zu können. Zweck unseres E-Mail-Marketings ist grundsätzlich, Sie über neue Angebote zu informieren und auch unseren unternehmerischen Zielen näher zu kommen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Daten werden verarbeitet?</h3>
        <p>Wenn Sie über unsere Website Abonnent unseres Newsletters werden, bestätigen Sie per E-Mail die Mitgliedschaft in einer E-Mail-Liste. Neben IP-Adresse und E-Mail-Adresse können auch Ihre Anrede, Ihr Name, Ihre Adresse und Ihre Telefonnummer gespeichert werden. Allerdings nur, wenn Sie dieser Datenspeicherungen zustimmen. Die als solche markierten Daten sind notwendig, damit Sie an dem angebotenen Dienst teilnehmen können. Die Angabe ist freiwillig, die Nichtangabe führt jedoch dazu, dass Sie den Dienst nicht nutzen können. Zusätzlich können etwa auch Informationen zu Ihrem Gerät oder zu Ihren bevorzugten Inhalten auf unserer Website gespeichert werden. Mehr zur Speicherung von Daten, wenn Sie eine Website besuchen, finden Sie im Abschnitt &#8220;Automatische Datenspeicherung&#8221;. Ihre Einwilligungserklärung zeichnen wir auf, damit wir stets nachweisen können, dass dieser unseren Gesetzen entspricht.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Dauer der Datenverarbeitung</h3>
        <p>Wenn Sie Ihre E-Mail-Adresse aus unserem E-Mail/Newsletter-Verteiler austragen, dürfen wir Ihre Adresse bis zu drei Jahren auf Grundlage unserer berechtigten Interessen speichern, damit wir Ihre damalige Einwilligung noch nachweisen können. Verarbeiten dürfen wir diese Daten nur, wenn wir uns gegen etwaige Ansprüche wehren müssen.</p>
        <p>Wenn Sie allerdings bestätigen, dass Sie uns die Einwilligung zur Newsletter-Anmeldung gegeben haben, können Sie jederzeit einen individuellen Löschantrag stellen. Widersprechen Sie der Einwilligung dauerhaft, behalten wir uns das Recht vor, Ihre E-Mail-Adresse in einer Sperrliste zu speichern. Solange Sie freiwillig unseren Newsletter abonniert haben, solange behalten wir selbstverständlich auch Ihre E-Mail-Adresse.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Widerspruchsrecht</h3>
        <p>Sie haben jederzeit die Möglichkeit Ihre Newsletter-Anmeldung zu kündigen. Dafür müssen Sie lediglich Ihre Einwilligung zur Newsletter-Anmeldung widerrufen. Das dauert im Normalfall nur wenige Sekunden bzw. einen oder zwei Klicks. Meistens finden Sie direkt am Ende jeder E-Mail einen Link, um das Newsletter-Abonnement zu kündigen. Wenn der Link im Newsletter wirklich nicht zu finden ist, kontaktieren Sie uns bitte per Mail und wir werden Ihr Newsletter-Abo unverzüglich kündigen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlage</h3>
        <p>Das Versenden unseres Newsletters erfolgt auf Grundlage Ihrer Einwilligung (Artikel 6 Abs. 1 lit. a DSGVO). Das heißt, wir dürfen Ihnen nur dann einen Newsletter schicken, wenn Sie sich zuvor aktiv dafür angemeldet haben. Gegebenenfalls können wir Ihnen auch Werbenachrichten senden, sofern Sie unser Kunde geworden sind und der Verwendung Ihrer E-Mailadresse für Direktwerbung nicht widersprochen haben.</p>
        <p>Informationen zu speziellen E-Mail-Marketing Diensten und wie diese personenbezogene Daten verarbeiten, erfahren Sie &#8211; sofern vorhanden &#8211; in den folgenden Abschnitten.</p>

        <h2 id="cookie-consent-management-platform-einleitung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Cookie Consent Management Platform Einleitung</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">Cookie Consent Management Platform Zusammenfassung</p>
          <p>👥 Betroffene: Website Besucher<br/>
🤝 Zweck: Einholung und Verwaltung der Zustimmung zu bestimmten Cookies und somit dem Einsatz bestimmter Tools<br/>
📝 Verarbeitete Daten: Daten zur Verwaltung der eingestellten Cookie-Einstellungen wie IP-Adresse, Zeitpunkt der Zustimmung, Art der Zustimmung, einzelne Zustimmungen. Mehr Details dazu finden Sie beim jeweils eingesetzten Tool.<br/>
📅 Speicherdauer: Hängt vom eingesetzten Tool ab, man muss sich auf Zeiträume von mehreren Jahren einstellen<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit.f DSGVO (berechtigte Interessen)</p>
        </div>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was ist eine Cookie Consent Management Platform?</h3>
        <p>Wir verwenden auf unserer Website eine Consent Management Platform (CMP) Software, die uns und Ihnen den korrekten und sicheren Umgang mit verwendeten Skripten und Cookies erleichtert. Die Software erstellt automatisch ein Cookie-Popup, scannt und kontrolliert alle Skripts und Cookies, bietet eine datenschutzrechtlich notwendige Cookie-Einwilligung für Sie und hilft uns und Ihnen den Überblick über alle Cookies zu behalten. Bei den meisten Cookie Consent Management Tools werden alle vorhandenen Cookies identifiziert und kategorisiert. Sie als Websitebesucher entscheiden dann selbst, ob und welche Skripte und Cookies Sie zulassen oder nicht zulassen. Die folgende Grafik stellt die Beziehung zwischen Browser, Webserver und CMP dar.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Warum verwenden wir ein Cookie-Management-Tool?</h3>
        <p>Unser Ziel ist es, Ihnen im Bereich Datenschutz die bestmögliche Transparenz zu bieten. Zudem sind wir dazu auch rechtlich verpflichtet. Wir wollen Sie über alle Tools und alle Cookies, die Daten von Ihnen speichern und verarbeiten können, so gut wie möglich aufklären. Es ist auch Ihr Recht, selbst zu entscheiden, welche Cookies Sie akzeptieren und welche nicht. Um Ihnen dieses Recht einzuräumen, müssen wir zuerst genau wissen, welche Cookies überhaupt auf unserer Website gelandet sind. Dank eines Cookie-Management-Tools, welches die Website regelmäßig nach allen vorhandenen Cookies scannt, wissen wir über alle Cookies Bescheid und können Ihnen DSGVO-konform Auskunft darüber geben. Über das Einwilligungssystem können Sie dann Cookies akzeptieren oder ablehnen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Daten werden verarbeitet?</h3>
        <p>Im Rahmen unseres Cookie-Management-Tools können Sie jedes einzelnen Cookies selbst verwalten und haben die vollständige Kontrolle über die Speicherung und Verarbeitung Ihrer Daten. Die Erklärung Ihrer Einwilligung wird gespeichert, damit wir Sie nicht bei jedem neuen Besuch unserer Website abfragen müssen und wir Ihre Einwilligung, wenn gesetzlich nötig, auch nachweisen können. Gespeichert wird dies entweder in einem Opt-in-Cookie oder auf einem Server. Je nach Anbieter des Cookie-Management-Tools variiert Speicherdauer Ihrer Cookie-Einwilligung. Meist werden diese Daten (etwa pseudonyme User-ID, Einwilligungs-Zeitpunkt, Detailangaben zu den Cookie-Kategorien oder Tools, Browser, Gerätinformationen) bis zu zwei Jahren gespeichert.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Dauer der Datenverarbeitung</h3>
        <p>Über die Dauer der Datenverarbeitung informieren wir Sie weiter unten, sofern wir weitere Informationen dazu haben. Generell verarbeiten wir personenbezogene Daten nur so lange wie es für die Bereitstellung unserer Dienstleistungen und Produkte unbedingt notwendig ist. Daten, die in Cookies gespeichert werden, werden unterschiedlich lange gespeichert. Manche Cookies werden bereits nach dem Verlassen der Website wieder gelöscht, andere können über einige Jahre in Ihrem Browser gespeichert sein. Die genaue Dauer der Datenverarbeitung hängt vom verwendeten Tool ab, meistens sollten Sie sich auf eine Speicherdauer von mehreren Jahren einstellen. In den jeweiligen Datenschutzerklärungen der einzelnen Anbieter erhalten Sie in der Regel genaue Informationen über die Dauer der Datenverarbeitung.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Widerspruchsrecht</h3>
        <p>Sie haben auch jederzeit das Recht und die Möglichkeit Ihre Einwilligung zur Verwendung von Cookies zu widerrufen. Das funktioniert entweder über unser Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Zum Beispiel können Sie auch die Datenerfassung durch Cookies verhindern, indem Sie in Ihrem Browser die Cookies verwalten, deaktivieren oder löschen.</p>
        <p>Informationen zu speziellen Cookie-Management-Tools, erfahren Sie &#8211; sofern vorhanden &#8211; in den folgenden Abschnitten.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlage</h3>
        <p>Wenn Sie Cookies zustimmen, werden über diese Cookies personenbezogene Daten von Ihnen verarbeitet und gespeichert. Falls wir durch Ihre <strong>Einwilligung</strong> (Artikel 6 Abs. 1 lit. a DSGVO) Cookies verwenden dürfen, ist diese Einwilligung auch gleichzeitig die Rechtsgrundlage für die Verwendung von Cookies bzw. die Verarbeitung Ihrer Daten. Um die Einwilligung zu Cookies verwalten zu können und Ihnen die Einwilligung ermöglichen zu können, kommt eine Cookie-Consent-Management-Platform-Software zum Einsatz. Der Einsatz dieser Software ermöglicht uns, die Website auf effiziente Weise rechtskonform zu betreiben, was ein <strong>berechtigtes Interesse</strong> (Artikel 6 Abs. 1 lit. f DSGVO) darstellt.</p>

        <h2 id="webdesign-einleitung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Webdesign Einleitung</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">Webdesign Datenschutzerklärung Zusammenfassung</p>
          <p>👥 Betroffene: Besucher der Website<br/>
🤝 Zweck: Verbesserung der Nutzererfahrung<br/>
📝 Verarbeitete Daten: Welche Daten verarbeitet werden, hängt stark von den verwendeten Diensten ab. Meist handelt es sich etwa um IP-Adresse, technische Daten, Spracheinstellungen,  Browserversion, Bildschirmauflösung und Name des Browsers. Mehr Details dazu finden Sie bei den jeweils eingesetzten Webdesign-Tools.<br/>
📅 Speicherdauer: abhängig von den eingesetzten Tools<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</p>
        </div>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was ist Webdesign?</h3>
        <p>Wir verwenden auf unserer Website verschiedene Tools, die unserem Webdesign dienen. Bei Webdesign geht es nicht, wie oft angenommen, nur darum, dass unsere Website hübsch aussieht, sondern auch um Funktionalität und Leistung. Aber natürlich ist die passende Optik einer Website auch eines der großen Ziele professionellen Webdesigns. Webdesign ist ein Teilbereich des Mediendesigns und beschäftigt sich sowohl mit der visuellen als auch der strukturellen und funktionalen Gestaltung einer Website. Ziel ist es mit Hilfe von Webdesign Ihre Erfahrung auf unserer Website zu verbessern. Im Webdesign-Jargon spricht man in diesem Zusammenhang von User-Experience (UX) und Usability. Unter User Experience versteht man alle Eindrücke und Erlebnisse, die der Websitebesucher auf einer Website erfährt. Ein Unterpunkt der User Experience ist die Usability. Dabei geht es um die Nutzerfreundlichkeit einer Website. Wert gelegt wird hier vor allem darauf, dass Inhalte, Unterseiten oder Produkte klar strukturiert sind und Sie leicht und schnell finden, wonach Sie suchen. Um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten, verwenden wir auch sogenannte Webdesign-Tools von Drittanbietern. Unter die Kategorie „Webdesign" fallen in dieser Datenschutzerklärung also alle Dienste, die unsere Website gestalterisch verbessern. Das können beispielsweise Schriftarten, diverse Plugins oder andere eingebundene Webdesign-Funktionen sein.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Warum verwenden wir Webdesign-Tools?</h3>
        <p>Wie Sie Informationen auf einer Website aufnehmen, hängt sehr stark von der Struktur, der Funktionalität und der visuellen Wahrnehmung der Website ab. Daher wurde auch für uns ein gutes und professionelles Webdesign immer wichtiger. Wir arbeiten ständig an der Verbesserung unserer Website und sehen dies auch als erweiterte Dienstleistung für Sie als Websitebesucher. Weiters hat eine schöne und funktionierende Website auch wirtschaftliche Vorteile für uns. Schließlich werden Sie uns nur besuchen und unsere Angebote in Anspruch nehmen, wenn Sie sich rundum wohl fühlen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Daten werden durch Webdesign-Tools gespeichert?</h3>
        <p>Wenn Sie unsere Website besuchen, können Webdesign-Elemente in unseren Seiten eingebunden sein, die auch Daten verarbeiten können. Um welche Daten es sich genau handelt, hängt natürlich stark von den verwendeten Tools ab. Weiter unter sehen Sie genau, welche Tools wir für unsere Website verwenden. Wir empfehlen Ihnen für nähere Informationen über die Datenverarbeitung auch die jeweilige Datenschutzerklärung der verwendeten Tools durchzulesen. Meistens erfahren Sie dort, welche Daten verarbeitet werden, ob Cookies eingesetzt werden und wie lange die Daten aufbewahrt werden. Durch Schriftarten wie etwa Google Fonts werden beispielsweise auch Informationen wie Spracheinstellungen, IP-Adresse, Version des Browsers, Bildschirmauflösung des Browsers und Name des Browsers automatisch an die Google-Server übertragen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Dauer der Datenverarbeitung</h3>
        <p>Wie lange Daten verarbeitet werden, ist sehr individuell und hängt von den eingesetzten Webdesign-Elementen ab. Wenn Cookies beispielsweise zum Einsatz kommen, kann die Aufbewahrungsdauer nur eine Minute, aber auch ein paar Jahre dauern. Machen Sie sich diesbezüglich bitte schlau. Dazu empfehlen wir Ihnen einerseits unseren allgemeinen Textabschnitt über Cookies sowie die Datenschutzerklärungen der eingesetzten Tools. Dort erfahren Sie in der Regel, welche Cookies genau eingesetzt werden, und welche Informationen darin gespeichert werden. Google-Font-Dateien werden zum Beispiel ein Jahr gespeichert. Damit soll die Ladezeit einer Website verbessert werden. Grundsätzlich werden Daten immer nur so lange aufbewahrt, wie es für die Bereitstellung des Dienstes nötig ist. Bei gesetzlichen Vorschreibungen können Daten auch länger gespeichert werden.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Widerspruchsrecht</h3>
        <p>Sie haben auch jederzeit das Recht und die Möglichkeit Ihre Einwilligung zur Verwendung von Cookies bzw. Drittanbietern zu widerrufen. Das funktioniert entweder über unser Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Sie können auch die Datenerfassung durch Cookies verhindern, indem Sie in Ihrem Browser die Cookies verwalten, deaktivieren oder löschen. Unter Webdesign-Elementen (meistens bei Schriftarten) gibt es allerdings auch Daten, die nicht ganz so einfach gelöscht werden können. Das ist dann der Fall, wenn Daten direkt bei einem Seitenaufruf automatisch erhoben und an einen Drittanbieter (wie z. B. Google) übermittelt werden. Wenden Sie sich dann bitte an den Support des entsprechenden Anbieters. Im Fall von Google erreichen Sie den Support unter <a href="https://support.google.com/?hl=de" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://support.google.com/?hl=de</a>.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlage</h3>
        <p>Wenn Sie eingewilligt haben, dass Webdesign-Tools eingesetzt werden dürfen, ist die Rechtsgrundlage der entsprechenden Datenverarbeitung diese Einwilligung. Diese Einwilligung stellt laut Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) die Rechtsgrundlage für die Verarbeitung personenbezogener Daten, wie sie bei der Erfassung durch Webdesign-Tools vorkommen kann, dar. Von unserer Seite besteht zudem ein berechtigtes Interesse, das Webdesign auf unserer Website zu verbessern. Schließlich können wir Ihnen nur dann ein schönes und professionelles Webangebot liefern. Die dafür entsprechende Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen). Wir setzen Webdesign-Tools gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben. Das wollen wir hier auf jeden Fall nochmals betonen.</p>
        <p>Informationen zu speziellen Webdesign-Tools erhalten Sie &#8211; sofern vorhanden &#8211; in den folgenden Abschnitten.</p>

        <h2 id="font-awesome-datenschutzerklaerung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Font Awesome Datenschutzerklärung</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">Font Awesome Datenschutzerklärung Zusammenfassung</p>
          <p>👥 Betroffene: Besucher der Website<br/>
🤝 Zweck: Optimierung unserer Serviceleistung<br/>
📝 Verarbeitete Daten: etwa IP-Adresse und und welche Icon-Dateien geladen werden. Mehr Details dazu finden Sie weiter unten in dieser Datenschutzerklärung.<br/>
📅 Speicherdauer: Dateien in identifizierbarer Form werden wenige Wochen gespeichert<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</p>
        </div>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was ist Font Awesome?</h3>
        <p>Wir verwenden auf unserer Website Font Awesome des amerikanischen Unternehmens Fonticons (307 S. Main St., Suite 202, Bentonville, AR 72712, USA). Wenn Sie eine unserer Webseite aufrufen, wird die Web-Schriftart Font Awesome (im Speziellen Icons) über das Font Awesome Content Delivery Netzwerk (CDN) geladen. So werden die Texte bzw. Schriften und Icons auf jedem Endgerät passend angezeigt. In dieser Datenschutzerklärung gehen wir näher auf die Datenspeicherung und Datenverarbeitung durch diesen Service ein.</p>
        <p>Icons spielen für Websites eine immer wichtigere Rolle. Font Awesome ist eine Web-Schriftart, die speziell für Webdesigner und Webentwickler entwickelt wurde. Mit Font Awesome können etwa Icons mit Hilfe der Stylesheet-Sprache CSS nach Belieben skaliert und gefärbt werden. Sie ersetzen so alte Bild-Icons. Font Awesome CDN ist der einfachste Weg die Icons oder Schriftarten auf Ihre Website zu laden. Dafür mussten wir nur eine kleine Code-Zeile in unsere Website einbinden.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Warum verwenden wir Font Awesome auf unserer Website?</h3>
        <p>Durch Font Awesome können Inhalte auf unserer Website besser aufbereitet werden. So können Sie sich auf unserer Website besser orientieren und die Inhalte leichter erfassen. Mit den Icons kann man sogar manchmal ganze Wörter ersetzen und Platz sparen. Da ist besonders praktisch, wenn wir Inhalte speziell für Smartphones optimieren. Diese Icons werden statt als Bild als HTML-Code eingefügt. Dadurch können wir die Icons mit CSS genauso bearbeiten, wie wir wollen. Gleichzeitig verbessern wir mit Font Awesome auch unsere Ladegeschwindigkeit, weil es sich nur um HTML-Elemente handelt und nicht um Icon-Bilder. All diese Vorteile helfen uns, die Website für Sie noch übersichtlicher, frischer und schneller zu machen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Daten werden von Font Awesome gespeichert?</h3>
        <p>Zum Laden von Icons und Symbolen wird das Font Awesome Content Delivery Network (CDN) verwendet. CDNs sind Netzwerke von Servern, die weltweit verteilt sind und es möglich machen, schnell Dateien aus der Nähe zu laden. So werden auch, sobald Sie eine unserer Seiten aufrufen, die entsprechenden Icons von Font Awesome bereitgestellt.</p>
        <p>Damit die Web-Schriftarten geladen werden können, muss Ihr Browser eine Verbindung zu den Servern des Unternehmens Fonticons, Inc. herstellen. Dabei wird Ihre IP-Adresse erkannt. Font Awesome sammelt auch Daten darüber, welche Icon-Dateien wann heruntergeladen werden. Weiters werden auch technische Daten wie etwa Ihre Browser-Version, Bildschirmauflösung oder der Zeitpunkt der ausgerufenen Seite übertragen.</p>
        <p>Aus folgenden Gründen werden diese Daten gesammelt und gespeichert:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>um Content Delivery Netzwerke zu optimieren</li>
          <li>um technische Fehler zu erkennen und zu beheben</li>
          <li>um CDNs vor Missbrauch und Angriffen zu schützen</li>
          <li>um Gebühren von Font Awesome Pro-Kunden berechnen zu können</li>
          <li>um die Beliebtheit von Icons zu erfahren</li>
          <li>um zu wissen, welchen Computer und welche Software Sie verwenden</li>
        </ul>
        <p>Falls Ihr Browser Web-Schriftarten nicht zulässt, wird automatisch eine Standardschrift Ihres PCs verwendet. Nach derzeitigem Stand unserer Erkenntnis werden keine Cookies gesetzt. Wir sind mit der Datenschutzabteilung von Font Awesome in Kontakt und geben Ihnen Bescheid, sobald wir näheres in Erfahrung bringen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Wie lange und wo werden die Daten gespeichert?</h3>
        <p>Font Awesome speichert Daten über die Nutzung des Content Delivery Network auf Servern auch in den Vereinigten Staaten von Amerika. Die CDN-Server befinden sich allerdings weltweit und speichern Userdaten, wo Sie sich befinden. In identifizierbarer Form werden die Daten in der Regel nur wenige Wochen gespeichert. Aggregierte Statistiken über die Nutzung von den CDNs können auch länger gespeichert werden. Personenbezogene Daten sind hier nicht enthalten.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Wie kann ich meine Daten löschen bzw. die Datenspeicherung verhindern?</h3>
        <p>Font Awesome speichert nach aktuellem Stand unseres Wissens keine personenbezogenen Daten über die Content Delivery Netzwerke. Wenn Sie nicht wollen, dass Daten über die verwendeten Icons gespeichert werden, können Sie leider unsere Website nicht besuchen. Wenn Ihr Browser keine Web-Schriftarten erlaubt, werden auch keine Daten übertragen oder gespeichert. In diesem Fall wird einfach die Standard-Schrift Ihres Computers verwendet.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlage</h3>
        <p>Wenn Sie eingewilligt haben, dass Font Awesome eingesetzt werden darf, ist die Rechtsgrundlage der entsprechenden Datenverarbeitung diese Einwilligung. Diese Einwilligung stellt laut <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</strong> die Rechtsgrundlage für die Verarbeitung personenbezogener Daten, wie sie bei der Erfassung durch Font Awesome vorkommen kann, dar.</p>
        <p>Von unserer Seite besteht zudem ein berechtigtes Interesse, Font Awesome zu verwenden, um unser Online-Service zu optimieren. Die dafür entsprechende Rechtsgrundlage ist <strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</strong>. Wir setzen Font Awesome gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben.</p>
        <p>Wir weisen darauf hin, dass nach Meinung des Europäischen Gerichtshofs derzeit kein angemessenes Schutzniveau für den Datentransfer in die USA besteht. Die Datenverarbeitung geschieht im Wesentlichen durch Font Awesome. Dies kann dazu führen, dass gegebenenfalls Daten nicht anonymisiert verarbeitet und gespeichert werden. Ferner können gegebenenfalls US-amerikanische staatliche Behörden Zugriff auf einzelne Daten nehmen. Es kann ferner vorkommen, dass diese Daten mit Daten aus möglichen anderen Diensten von Font Awesome, bei denen Sie ein Nutzerkonto haben, verknüpft werden.</p>
        <p>Wenn Sie mehr über Font Awesome und deren Umgang mit Daten erfahren wollen, empfehlen wir Ihnen die Datenschutzerklärung unter <a href="https://fontawesome.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://fontawesome.com/privacy</a> und die Hilfeseite unter <a href="https://fontawesome.com/support" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://fontawesome.com/support</a>.</p>

        <h2 id="getty-images-datenschutzerklaerung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Getty Images Datenschutzerklärung</h2>
        <p>Wir verwenden für unsere Website das Bildportal Getty Images. Dienstanbieter ist das amerikanische Unternehmen Getty Images Inc., 605 5th Avenue South Suite 400 Seattle, WA 98104, USA.</p>
        <p>Getty Images verarbeitet Daten von Ihnen u.a. auch in den USA. Getty Images ist aktiver Teilnehmer des EU-US Data Privacy Frameworks, wodurch der korrekte und sichere Datentransfer personenbezogener Daten von EU-Bürgern in die USA geregelt wird. Mehr Informationen dazu finden Sie auf <a href="https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en</a>.</p>
        <p>Zudem verwendet Getty Images sogenannte Standardvertragsklauseln (= Art. 46. Abs. 2 und 3 DSGVO). Standardvertragsklauseln (Standard Contractual Clauses – SCC) sind von der EU-Kommission bereitgestellte Mustervorlagen und sollen sicherstellen, dass Ihre Daten auch dann den europäischen Datenschutzstandards entsprechen, wenn diese in Drittländer (wie beispielsweise in die USA) überliefert und dort gespeichert werden. Durch das EU-US Data Privacy Framework und durch die Standardvertragsklauseln verpflichtet sich Getty Images, bei der Verarbeitung Ihrer relevanten Daten, das europäische Datenschutzniveau einzuhalten, selbst wenn die Daten in den USA gespeichert, verarbeitet und verwaltet werden. Diese Klauseln basieren auf einem Durchführungsbeschluss der EU-Kommission. Sie finden den Beschluss und die entsprechenden Standardvertragsklauseln u.a. hier: <a href="https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de</a>.</p>
        <p>Mehr über die Daten und Standardvertragsklauseln, die durch die Verwendung von Getty Images verarbeitet werden, erfahren Sie in der Datenschutzerklärung auf <a href="https://www.gettyimages.at/company/privacy-policy?tid=113196099" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://www.gettyimages.at/company/privacy-policy</a>.</p>

        <h2 id="google-fonts-datenschutzerklaerung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Google Fonts Datenschutzerklärung</h2>
        <div className="border border-gray-300 rounded p-4 my-4">
          <p className="font-semibold mb-2">Google Fonts Datenschutzerklärung Zusammenfassung</p>
          <p>👥 Betroffene: Besucher der Website<br/>
🤝 Zweck: Optimierung unserer Serviceleistung<br/>
📝 Verarbeitete Daten: Daten wie etwa IP-Adresse und CSS- und Schrift-Anfragen. Mehr Details dazu finden Sie weiter unten in dieser Datenschutzerklärung.<br/>
📅 Speicherdauer: Font-Dateien werden bei Google ein Jahr gespeichert<br/>
⚖️ Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</p>
        </div>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was sind Google Fonts?</h3>
        <p>Auf unserer Website verwenden wir Google Fonts. Das sind die &#8220;Google-Schriften&#8221; der Firma Google Inc. Für den europäischen Raum ist das Unternehmen Google Ireland Limited (Gordon House, Barrow Street Dublin 4, Irland) für alle Google-Dienste verantwortlich.</p>
        <p>Für die Verwendung von Google-Schriftarten müssen Sie sich nicht anmelden bzw. ein Passwort hinterlegen. Weiters werden auch keine Cookies in Ihrem Browser gespeichert. Die Dateien (CSS, Schriftarten/Fonts) werden über die Google-Domains fonts.googleapis.com und fonts.gstatic.com angefordert. Laut Google sind die Anfragen nach CSS und Schriften vollkommen getrennt von allen anderen Google-Diensten. Wenn Sie ein Google-Konto haben, brauchen Sie keine Sorge haben, dass Ihre Google-Kontodaten, während der Verwendung von Google Fonts, an Google übermittelt werden. Google erfasst die Nutzung von CSS (Cascading Style Sheets) und der verwendeten Schriftarten und speichert diese Daten sicher. Wie die Datenspeicherung genau aussieht, werden wir uns noch im Detail ansehen.</p>
        <p>Google Fonts (früher Google Web Fonts) ist ein Verzeichnis mit über 800 Schriftarten, die <a href="https://de.wikipedia.org/wiki/Google_LLC" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Google</a> Ihren Nutzern kostenlos zu Verfügung stellen.</p>
        <p>Viele dieser Schriftarten sind unter der SIL Open Font License veröffentlicht, während andere unter der Apache-Lizenz veröffentlicht wurden. Beides sind freie Software-Lizenzen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Warum verwenden wir Google Fonts auf unserer Website?</h3>
        <p>Mit Google Fonts können wir auf der eigenen Webseite Schriften nutzen, und müssen sie nicht auf unserem eigenen Server hochladen. Google Fonts ist ein wichtiger Baustein, um die Qualität unserer Webseite hoch zu halten. Alle Google-Schriftarten sind automatisch für das Web optimiert und dies spart Datenvolumen und ist speziell für die Verwendung bei mobilen Endgeräten ein großer Vorteil. Wenn Sie unsere Seite besuchen, sorgt die niedrige Dateigröße für eine schnelle Ladezeit. Des Weiteren sind Google Fonts sichere Web Fonts. Unterschiedliche Bildsynthese-Systeme (Rendering) in verschiedenen Browsern, Betriebssystemen und mobilen Endgeräten können zu Fehlern führen. Solche Fehler können teilweise Texte bzw. ganze Webseiten optisch verzerren. Dank des schnellen Content Delivery Network (CDN) gibt es mit Google Fonts keine plattformübergreifenden Probleme. Google Fonts unterstützt alle gängigen Browser (Google Chrome, Mozilla Firefox, Apple Safari, Opera) und funktioniert zuverlässig auf den meisten modernen mobilen Betriebssystemen, einschließlich Android 2.2+ und iOS 4.2+ (iPhone, iPad, iPod). Wir verwenden die Google Fonts also, damit wir unser gesamtes Online-Service so schön und einheitlich wie möglich darstellen können.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Welche Daten werden von Google gespeichert?</h3>
        <p>Wenn Sie unsere Webseite besuchen, werden die Schriften über einen Google-Server nachgeladen. Durch diesen externen Aufruf werden Daten an die Google-Server übermittelt. So erkennt Google auch, dass Sie bzw. Ihre IP-Adresse unsere Webseite besucht. Die Google Fonts API wurde entwickelt, um Verwendung, Speicherung und Erfassung von Endnutzerdaten auf das zu reduzieren, was für eine ordentliche Bereitstellung von Schriften nötig ist. API steht übrigens für „Application Programming Interface" und dient unter anderem als Datenübermittler im Softwarebereich.</p>
        <p>Google Fonts speichert CSS- und Schrift-Anfragen sicher bei Google und ist somit geschützt. Durch die gesammelten Nutzungszahlen kann Google feststellen, wie gut die einzelnen Schriften ankommen. Die Ergebnisse veröffentlicht Google auf internen Analyseseiten, wie beispielsweise Google Analytics. Zudem verwendet Google auch Daten des eigenen Web-Crawlers, um festzustellen, welche Webseiten Google-Schriften verwenden. Diese Daten werden in der BigQuery-Datenbank von Google Fonts veröffentlicht. Unternehmer und Entwickler nützen das Google-Webservice BigQuery, um große Datenmengen untersuchen und bewegen zu können.</p>
        <p>Zu bedenken gilt allerdings noch, dass durch jede Google Font Anfrage auch Informationen wie Spracheinstellungen, IP-Adresse, Version des Browsers, Bildschirmauflösung des Browsers und Name des Browsers automatisch an die Google-Server übertragen werden. Ob diese Daten auch gespeichert werden, ist nicht klar feststellbar bzw. wird von Google nicht eindeutig kommuniziert.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Wie lange und wo werden die Daten gespeichert?</h3>
        <p>Anfragen für CSS-Assets speichert Google einen Tag lang auf seinen Servern, die hauptsächlich außerhalb der EU angesiedelt sind. Das ermöglicht uns, mithilfe eines Google-Stylesheets die Schriftarten zu nutzen. Ein Stylesheet ist eine Formatvorlage, über die man einfach und schnell z.B. das Design bzw. die Schriftart einer Webseite ändern kann.</p>
        <p>Die Font-Dateien werden bei Google ein Jahr gespeichert. Google verfolgt damit das Ziel, die Ladezeit von Webseiten grundsätzlich zu verbessern. Wenn Millionen von Webseiten auf die gleichen Schriften verweisen, werden sie nach dem ersten Besuch zwischengespeichert und erscheinen sofort auf allen anderen später besuchten Webseiten wieder. Manchmal aktualisiert Google Schriftdateien, um die Dateigröße zu reduzieren, die Abdeckung von Sprache zu erhöhen und das Design zu verbessern.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Wie kann ich meine Daten löschen bzw. die Datenspeicherung verhindern?</h3>
        <p>Jene Daten, die Google für einen Tag bzw. ein Jahr speichert können nicht einfach gelöscht werden. Die Daten werden beim Seitenaufruf automatisch an Google übermittelt. Um diese Daten vorzeitig löschen zu können, müssen Sie den Google-Support auf <a href="https://support.google.com/?hl=de" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://support.google.com/?hl=de</a> kontaktieren. Datenspeicherung verhindern Sie in diesem Fall nur, wenn Sie unsere Seite nicht besuchen.</p>
        <p>Anders als andere Web-Schriften erlaubt uns Google uneingeschränkten Zugriff auf alle Schriftarten. Wir können also unlimitiert auf ein Meer an Schriftarten zugreifen und so das Optimum für unsere Webseite rausholen. Mehr zu Google Fonts und weiteren Fragen finden Sie auf <a href="https://developers.google.com/fonts/faq" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://developers.google.com/fonts/faq</a>. Dort geht zwar Google auf datenschutzrelevante Angelegenheiten ein, doch wirklich detaillierte Informationen über Datenspeicherung sind nicht enthalten. Es ist relativ schwierig, von Google wirklich präzise Informationen über gespeicherten Daten zu bekommen.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Rechtsgrundlage</h3>
        <p>Wenn Sie eingewilligt haben, dass Google Fonts eingesetzt werden darf, ist die Rechtsgrundlage der entsprechenden Datenverarbeitung diese Einwilligung. Diese Einwilligung stellt laut <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</strong> die Rechtsgrundlage für die Verarbeitung personenbezogener Daten, wie sie bei der Erfassung durch Google Fonts vorkommen kann, dar.</p>
        <p>Von unserer Seite besteht zudem ein berechtigtes Interesse, Google Font zu verwenden, um unser Online-Service zu optimieren. Die dafür entsprechende Rechtsgrundlage ist <strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</strong>. Wir setzen Google Font gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben.</p>
        <p>Google verarbeitet Daten von Ihnen u.a. auch in den USA. Google ist aktiver Teilnehmer des EU-US Data Privacy Frameworks, wodurch der korrekte und sichere Datentransfer personenbezogener Daten von EU-Bürgern in die USA geregelt wird. Mehr Informationen dazu finden Sie auf <a href="https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://commission.europa.eu/document/fa09cbad-dd7d-4684-ae60-be03fcb0fddf_en</a>.</p>
        <p>Zudem verwendet Google sogenannte Standardvertragsklauseln (= Art. 46. Abs. 2 und 3 DSGVO). Standardvertragsklauseln (Standard Contractual Clauses – SCC) sind von der EU-Kommission bereitgestellte Mustervorlagen und sollen sicherstellen, dass Ihre Daten auch dann den europäischen Datenschutzstandards entsprechen, wenn diese in Drittländer (wie beispielsweise in die USA) überliefert und dort gespeichert werden. Durch das EU-US Data Privacy Framework und durch die Standardvertragsklauseln verpflichtet sich Google, bei der Verarbeitung Ihrer relevanten Daten, das europäische Datenschutzniveau einzuhalten, selbst wenn die Daten in den USA gespeichert, verarbeitet und verwaltet werden. Diese Klauseln basieren auf einem Durchführungsbeschluss der EU-Kommission. Sie finden den Beschluss und die entsprechenden Standardvertragsklauseln u.a. hier: <a href="https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de</a></p>
        <p>Die Google Ads Datenverarbeitungsbedingungen (Google Ads Data Processing Terms), welche auf die Standardvertragsklauseln verweisen, finden Sie unter <a href="https://business.safety.google/intl/de/adsprocessorterms/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://business.safety.google/intl/de/adsprocessorterms/</a>.</p>
        <p>Welche Daten grundsätzlich von Google erfasst werden und wofür diese Daten verwendet werden, können Sie auch auf <a href="https://www.google.com/intl/de/policies/privacy/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">https://www.google.com/intl/de/policies/privacy/</a> nachlesen.</p>

        <h2 id="google-fonts-lokal-datenschutzerklaerung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Google Fonts Lokal Datenschutzerklärung</h2>
        <p>Auf unserer Website nutzen wir Google Fonts der Firma Google Inc. Für den europäischen Raum ist das Unternehmen Google Ireland Limited (Gordon House, Barrow Street Dublin 4, Irland) verantwortlich. Wir haben die Google-Schriftarten lokal, d.h. auf unserem Webserver &#8211; nicht auf den Servern von Google &#8211; eingebunden. Dadurch gibt es keine Verbindung zu Google-Servern und somit auch keine Datenübertragung oder Speicherung.</p>
        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Was sind Google Fonts?</h3>
        <p>Früher nannte man Google Fonts auch Google Web Fonts. Dabei handelt es sich um ein interaktives Verzeichnis mit über 800 Schriftarten, die <a href="https://de.wikipedia.org/wiki/Google_LLC" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Google</a> kostenlos bereitstellt. Mit Google Fonts könnte man Schriften nutzen, ohne sie auf den eigenen Server hochzuladen. Doch um diesbezüglich jede Informationsübertragung zu Google-Servern zu unterbinden, haben wir die Schriftarten auf unseren Server heruntergeladen. Auf diese Weise handeln wir datenschutzkonform und senden keine Daten an Google Fonts weiter.</p>

        <h2 id="erklaerung-verwendeter-begriffe" className="mb-4 mt-8 text-xl font-bold text-gray-900">Erklärung verwendeter Begriffe</h2>
        <p>Wir sind stets bemüht unsere Datenschutzerklärung so klar und verständlich wie möglich zu verfassen. Besonders bei technischen und rechtlichen Themen ist das allerdings nicht immer ganz einfach. Es macht oft Sinn juristische Begriffe (wie z. B. personenbezogene Daten) oder bestimmte technische Ausdrücke (wie z. B. Cookies, IP-Adresse) zu verwenden. Wir möchte diese aber nicht ohne Erklärung verwenden. Nachfolgend finden Sie nun eine alphabetische Liste von wichtigen verwendeten Begriffen, auf die wir in der bisherigen Datenschutzerklärung vielleicht noch nicht ausreichend eingegangen sind. Falls diese Begriffe der DSGVO entnommen wurden und es sich um Begriffsbestimmungen handelt, werden wir hier auch die DSGVO-Texte anführen und gegebenenfalls noch eigene Erläuterungen hinzufügen.</p>

        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Aufsichtsbehörde</h3>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„Aufsichtsbehörde"</strong> eine von einem Mitgliedstaat gemäß Artikel 51 eingerichtete unabhängige staatliche Stelle;</p>
        </blockquote>
        <p><strong>Erläuterung:</strong> &#8220;Aufsichtsbehörden&#8221; sind immer staatliche, unabhängige Einrichtungen, die auch in bestimmten Fällen weisungsbefugt sind. Sie dienen der Durchführung der sogenannten Staatsaufsicht und sind in Ministerien, speziellen Abteilungen oder anderen Behörden angesiedelt. Für den Datenschutz in Österreich gibt es eine österreichische <a href="https://www.dsb.gv.at/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Datenschutzbehörde</a>, für Deutschland gibt es für jedes Bundesland eine eigene Datenschutzbehörde.</p>

        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Auftragsverarbeiter</h3>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„Auftragsverarbeiter"</strong> eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet;</p>
        </blockquote>
        <p><strong>Erläuterung:</strong> Wir sind als Unternehmen und Websiteinhaber für alle Daten, die wir von Ihnen verarbeiten verantwortlich. Neben den Verantwortlichen kann es auch sogenannte Auftragsverarbeiter geben. Dazu zählt jedes Unternehmen bzw. jede Person, die in unserem Auftrag personenbezogene Daten verarbeitet. Auftragsverarbeiter können folglich, neben Dienstleistern wie Steuerberater, etwa auch Hosting- oder Cloudanbieter, Bezahlungs- oder Newsletter-Anbieter oder große Unternehmen wie beispielsweise Google oder Microsoft sein.</p>

        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Betroffene Aufsichtsbehörde</h3>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„betroffene Aufsichtsbehörde"</strong> eine Aufsichtsbehörde, die von der Verarbeitung personenbezogener Daten betroffen ist, weil a) der Verantwortliche oder der Auftragsverarbeiter im Hoheitsgebiet des Mitgliedstaats dieser Aufsichtsbehörde niedergelassen ist, b) diese Verarbeitung erhebliche Auswirkungen auf betroffene Personen mit Wohnsitz im Mitgliedstaat dieser Aufsichtsbehörde hat oder haben kann oder c) eine Beschwerde bei dieser Aufsichtsbehörde eingereicht wurde;</p>
        </blockquote>
        <p><strong>Erläuterung:</strong> In Deutschland hat jedes Bundesland eine eigene Aufsichtsbehörde für Datenschutz. Wenn Ihr Firmensitz (Hauptniederlassung) also in Deutschland ist, ist grundsätzlich die jeweilige Aufsichtsbehörde des Bundeslandes Ihr Ansprechpartner. In Österreich gibt es für das ganze Land nur eine <a href="https://www.dsb.gv.at/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Aufsichtsbehörde für Datenschutz</a>.</p>

        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Einwilligung</h3>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„Einwilligung"</strong> der betroffenen Person jede freiwillig für den bestimmten Fall, in informierter Weise und unmissverständlich abgegebene Willensbekundung in Form einer Erklärung oder einer sonstigen eindeutigen bestätigenden Handlung, mit der die betroffene Person zu verstehen gibt, dass sie mit der Verarbeitung der sie betreffenden personenbezogenen Daten einverstanden ist;</p>
        </blockquote>
        <p><strong>Erläuterung:</strong> In der Regel erfolgt bei Websites eine solche Einwilligung über ein Cookie-Consent-Tool. Sie kennen das bestimmt. Immer wenn Sie erstmals eine Website besuchen, werden Sie meist über einen Banner gefragt, ob Sie der Datenverarbeitung zustimmen bzw. einwilligen. Meist können Sie auch individuelle Einstellungen treffen und so selbst entscheiden, welche Datenverarbeitung Sie erlauben und welche nicht. Wenn Sie nicht einwilligen, dürfen auch keine personenbezogene Daten von Ihnen verarbeitet werden. Grundsätzlich kann eine Einwilligung natürlich auch schriftlich, also nicht über ein Tool, erfolgen.</p>

        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Personenbezogene Daten</h3>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„personenbezogene Daten"</strong> alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden „betroffene Person") beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung oder zu einem oder mehreren besonderen Merkmalen, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind, identifiziert werden kann;</p>
        </blockquote>
        <p><strong>Erläuterung:</strong> Personenbezogene Daten sind also all jene Daten, die Sie als Person identifizieren können. Das sind in der Regel Daten wie etwa:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Name</li>
          <li>Adresse</li>
          <li>E-Mail-Adresse</li>
          <li>Post-Anschrift</li>
          <li>Telefonnummer</li>
          <li>Geburtsdatum</li>
          <li>Kennnummern wie Sozialversicherungsnummer, Steueridentifikationsnummer, Personalausweisnummer oder Matrikelnummer</li>
          <li>Bankdaten wie Kontonummer, Kreditinformationen, Kontostände uvm.</li>
        </ul>
        <p>Laut Europäischem Gerichtshof (EuGH) zählt auch Ihre <strong>IP-Adresse zu den personenbezogenen Daten</strong>. IT-Experten können anhand Ihrer IP-Adresse zumindest den ungefähren Standort Ihres Geräts und in weiterer Folge Sie als Anschlussinhabers feststellen. Daher benötigt auch das Speichern einer IP-Adresse eine Rechtsgrundlage im Sinne der DSGVO. Es gibt auch noch sogenannte <strong>„besondere Kategorien"</strong> der personenbezogenen Daten, die auch besonders schützenswert sind. Dazu zählen:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>rassische und ethnische Herkunft</li>
          <li>politische Meinungen</li>
          <li>religiöse bzw. weltanschauliche Überzeugungen</li>
          <li>die Gewerkschaftszugehörigkeit</li>
          <li>genetische Daten wie beispielsweise Daten, die aus Blut- oder Speichelproben entnommen werden</li>
          <li>biometrische Daten (das sind Informationen zu psychischen, körperlichen oder verhaltenstypischen Merkmalen, die eine Person identifizieren können)</li>
          <li>Gesundheitsdaten</li>
          <li>Daten zur sexuellen Orientierung oder zum Sexualleben</li>
        </ul>

        <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">Profiling</h3>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„Profiling"</strong> jede Art der automatisierten Verarbeitung personenbezogener Daten, die darin besteht, dass diese personenbezogenen Daten verwendet werden, um bestimmte persönliche Aspekte, die sich auf eine natürliche Person beziehen, zu bewerten, insbesondere um Aspekte bezüglich Arbeitsleistung, wirtschaftliche Lage, Gesundheit, persönliche Vorlieben, Interessen, Zuverlässigkeit, Verhalten, Aufenthaltsort oder Ortswechsel dieser natürlichen Person zu analysieren oder vorherzusagen;</p>
        </blockquote>
        <p><strong>Erläuterung:</strong> Beim Profiling werden verschiedene Informationen über eine Person zusammengetragen, um daraus mehr über diese Person zu erfahren. Im Webbereich wird Profiling häufig für Werbezwecke oder auch für Bonitätsprüfungen angewandt. Web- bzw. Werbeanalyseprogramme sammeln zum Beispiel Daten über Ihre Verhalten und Ihre Interessen auf einer Website. Daraus ergibt sich ein spezielles Userprofil, mit dessen Hilfe Werbung gezielt an eine Zielgruppe ausgespielt werden kann.</p>
        <p>&nbsp;</p>

        <h2 id="verantwortlicher" className="mb-4 mt-8 text-xl font-bold text-gray-900">Verantwortlicher</h2>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„Verantwortlicher"</strong> die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet; sind die Zwecke und Mittel dieser Verarbeitung durch das Unionsrecht oder das Recht der Mitgliedstaaten vorgegeben, so kann der Verantwortliche beziehungsweise können die bestimmten Kriterien seiner Benennung nach dem Unionsrecht oder dem Recht der Mitgliedstaaten vorgesehen werden;</p>
        </blockquote>
        <p><strong>Erläuterung:</strong> In unserem Fall sind wir für die Verarbeitung Ihrer personenbezogenen Daten verantwortlich und folglich der &#8220;Verantwortliche&#8221;. Wenn wir erhobene Daten zur Verarbeitung an andere Dienstleister weitergeben, sind diese &#8220;Auftragsverarbeiter&#8221;. Dafür muss ein &#8220;Auftragsverarbeitungsvertrag (AVV)&#8221; unterzeichnet werden.</p>
        <p>&nbsp;</p>

        <h2 id="verarbeitung" className="mb-4 mt-8 text-xl font-bold text-gray-900">Verarbeitung</h2>
        <p><strong>Begriffsbestimmung nach Artikel 4 der DSGVO</strong></p>
        <p>Im Sinne dieser Verordnung bezeichnet der Ausdruck:</p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
          <p><strong>„Verarbeitung"</strong> jeden mit oder ohne Hilfe automatisierter Verfahren ausgeführten Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten wie das Erheben, das Erfassen, die Organisation, das Ordnen, die Speicherung, die Anpassung oder Veränderung, das Auslesen, das Abfragen, die Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder eine andere Form der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung;</p>
        </blockquote>
        <p><strong>Anmerkung:</strong> Wenn wir in unserer Datenschutzerklärung von Verarbeitung sprechen, meinen wir damit jegliche Art von Datenverarbeitung. Dazu zählt, wie oben in der originalen DSGVO-Erklärung erwähnt, nicht nur das Erheben sondern auch das Speichern und Verarbeiten von Daten.</p>

        <h2 id="schlusswort" className="mb-4 mt-8 text-xl font-bold text-gray-900">Schlusswort</h2>
        <p>Herzlichen Glückwunsch! Wenn Sie diese Zeilen lesen, haben Sie sich wirklich durch unsere gesamte Datenschutzerklärung „gekämpft" oder zumindest bis hier hin gescrollt. Wie Sie am Umfang unserer Datenschutzerklärung sehen, nehmen wir den Schutz Ihrer persönlichen Daten, alles andere als auf die leichte Schulter.<br/>
Uns ist es wichtig, Sie nach bestem Wissen und Gewissen über die Verarbeitung personenbezogener Daten zu informieren. Dabei wollen wir Ihnen aber nicht nur mitteilen, welche Daten verarbeitet werden, sondern auch die Beweggründe für die Verwendung diverser Softwareprogramme näherbringen. In der Regel klingen Datenschutzerklärung sehr technisch und juristisch. Da die meisten von Ihnen aber keine Webentwickler oder Juristen sind, wollten wir auch sprachlich einen anderen Weg gehen und den Sachverhalt in einfacher und klarer Sprache erklären. Immer ist dies natürlich aufgrund der Thematik nicht möglich. Daher werden die wichtigsten Begriffe am Ende der Datenschutzerklärung näher erläutert.<br/>
Bei Fragen zum Thema Datenschutz auf unserer Website zögern Sie bitte nicht, uns oder die verantwortliche Stelle zu kontaktieren. Wir wünschen Ihnen noch eine schöne Zeit und hoffen, Sie auf unserer Website bald wieder begrüßen zu dürfen.</p>
        <p>Alle Texte sind urheberrechtlich geschützt.</p>
        <p style={{marginTop: '15px'}}>Quelle: <a href="https://www.adsimple.at/datenschutz-generator/" target="_blank" rel="noopener" className="text-blue-600 hover:underline" title="Datenschutzerklärung Generator Österreich">Datenschutzerklärung</a> erstellt mit dem Datenschutz Generator für Österreich von AdSimple</p>
      </article>

      <ConsentWithdrawalSection user={user} />
    </div>
  )
}
