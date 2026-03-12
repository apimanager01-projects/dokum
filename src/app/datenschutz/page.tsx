import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WithdrawConsentButton } from '@/components/consent/WithdrawConsentButton'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – Dokum',
}

export default async function DatenschutzPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.['role'] === 'admin'
  const showWithdrawal = !!user && !isAdmin && !!user.user_metadata?.['consent_accepted_at']

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
      </article>

      {showWithdrawal && (
        <section className="mt-12 rounded-md border border-red-100 bg-red-50 p-6">
          <h2 className="mb-2 text-base font-semibold text-gray-900">Einwilligung widerrufen</h2>
          <p className="mb-4 text-sm text-gray-600">
            Du kannst deine Einwilligung zur Datenverarbeitung jederzeit widerrufen.
            Du wirst anschließend abgemeldet. Zur vollständigen Datenlöschung kontaktiere uns.
          </p>
          <WithdrawConsentButton />
        </section>
      )}
    </div>
  )
}
