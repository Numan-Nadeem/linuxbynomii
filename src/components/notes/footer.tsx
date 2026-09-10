"use client";

export function Footer() {
  return (
    <footer className="mt-auto border-t-8 border-hazard bg-tv" aria-label="Document footer">
      {/* hazard stripe */}
      <div aria-hidden className="hazard-stripe h-3 border-b border-line" />

      <div className="px-4 md:px-8 pt-10 pb-6">
        <p className="micro text-phos-faint mb-3">[ END OF DOSSIER ]</p>
        <p className="font-macro macro-footer text-phos select-none">
          END OF<br />
          <span className="text-hazard hazard-glow">TRANSMISSION</span>
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
          {[
            ["SOURCE", "LINUX SYSADMIN COURSE.DOCX"],
            ["DOC REF", "LX-09 / REV 2.6"],
            ["ARCHETYPE", "TACTICAL TELEMETRY / CRT"],
            ["SUBSTRATE", "#0A0A0A DEACTIVATED"],
          ].map(([k, v]) => (
            <div key={k} className="bg-tv px-3 py-3">
              <p className="micro text-phos-faint">{k}</p>
              <p className="micro-lg text-phos-dim mt-1 break-all">{v}</p>
            </div>
          ))}
        </div>

        {/* marks as structural geometry */}
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="micro text-phos-faint">
            © LX-09 DOSSIER — TRAINING USE ONLY
          </span>
          <div aria-hidden className="flex items-center gap-4 text-phos-faint font-macro text-lg select-none">
            <span className="hover:text-hazard transition-colors">©</span>
            <span className="hover:text-hazard transition-colors">®</span>
            <span className="hover:text-hazard transition-colors">™</span>
          </div>
          <span className="micro text-phos-faint">{"///"} 51.5072°N 0.1276°W</span>
        </div>
      </div>
    </footer>
  );
}
