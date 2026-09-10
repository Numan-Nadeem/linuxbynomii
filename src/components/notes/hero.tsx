"use client";

import type { CourseStats } from "@/data/course-types";

const TICKER_ITEMS = [
  "$ systemctl status sshd",
  "$ tar -xzvf archive.tar.gz",
  "$ usermod -aG wheel operator",
  "$ ls -la /etc",
  "$ firewall-cmd --list-all",
  "$ df -h",
  "$ journalctl -f",
  "$ rsync -av /src/ /dest/",
  "$ semanage fcontext -l",
  "$ lvextend -L +7G /dev/vg/data",
  "$ ss -tan",
  "$ crontab -e",
];

export function Hero({ stats }: { stats: CourseStats }) {
  const ticker = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div id="top" className="relative scroll-mt-20 border-b border-line bg-tv dot-grid">
      {/* meta strip */}
      <div className="flex items-stretch justify-between border-b border-line">
        <span className="px-3 md:px-8 py-1.5 micro text-phos-dim border-r border-line">
          [ OPERATOR TRAINING DOSSIER ]
        </span>
        <span className="hidden sm:block px-3 py-1.5 micro text-phos-faint border-r border-line">
          CLASSIFICATION: TRAINING MATERIAL
        </span>
        <span className="px-3 md:px-8 py-1.5 micro text-hazard">DECLASSIFIED / UNRESTRICTED</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* macro title */}
        <div className="px-3 md:px-8 pt-10 md:pt-16 pb-8 overflow-hidden">
          <h1 className="font-macro macro-hero text-phos">
            LINUX
            <br />
            SYSTEM
            <br />
            <span className="text-hazard hazard-glow">ADMIN</span>
            <span className="cursor-block" aria-hidden />
          </h1>

          {/* textural contrast — degraded serif line */}
          <p className="font-serif-tex italic text-phos-dim mt-6 md:mt-8 max-w-[42ch] text-[15px] md:text-[17px] leading-snug">
            Field notes for operators of the machine room — eight sections of
            terminal doctrine, transcribed from the source dossier and rendered
            on phosphor glass.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 micro text-phos-faint">
            <span>SOURCE: LINUX SYSTEM ADMINISTRATION COURSE.DOCX</span>
            <span aria-hidden className="text-hazard">{"///"}</span>
            <span>MODE: TACTICAL TELEMETRY</span>
            <span aria-hidden className="text-hazard">{"///"}</span>
            <span>SUBSTRATE: CRT #0A0A0A</span>
          </div>
        </div>

        {/* boot log panel */}
        <div className="border-t lg:border-t-0 lg:border-l border-line bg-[#050505] flex flex-col">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="micro text-phos-dim">[ BOOT SEQUENCE ]</span>
            <span aria-hidden className="micro text-hazard animate-pulse">REC</span>
          </div>
          <div className="px-3 py-3 font-mono text-[11px] leading-[18px] text-phos-dim flex-1">
            <p><span className="text-phos-faint">[ OK ]</span> Mounted /notes from DOSSIER.LX-09.</p>
            <p><span className="text-phos-faint">[ OK ]</span> Indexed {stats.sections} sections.</p>
            <p><span className="text-phos-faint">[ OK ]</span> Loaded {stats.topics} modules.</p>
            <p><span className="text-phos-faint">[ OK ]</span> Buffered {stats.commands} commands.</p>
            <p><span className="text-phos-faint">[ OK ]</span> Attached {stats.figures} evidence plates.</p>
            <p className="text-hazard hazard-glow">&gt; READY. SELECT SECTION_</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-line border-t border-line">
            {[
              ["SECTIONS", stats.sections],
              ["MODULES", stats.topics],
              ["COMMANDS", stats.commands],
              ["FIGURES", stats.figures],
            ].map(([k, v]) => (
              <div key={k as string} className="bg-tv px-3 py-2">
                <p className="micro text-phos-faint">{k}</p>
                <p className="font-macro text-xl text-phos phos-glow">
                  {String(v).padStart(2, "0")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ticker */}
      <div className="relative overflow-hidden border-t border-line bg-[#0f0f0f]" aria-hidden>
        <div className="ticker-track flex w-max whitespace-nowrap py-1.5">
          {ticker.map((t, i) => (
            <span key={i} className="micro text-phos-faint px-4 flex items-center gap-4">
              {t}
              <span className="text-hazard">{"///"}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
