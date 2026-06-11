import { useMemo, useState } from 'react';
import { Check, Clipboard, FileText, ListChecks } from 'lucide-react';
import type { PortalContentItem } from '../content/portal';

interface SkillDocumentProps {
  item: PortalContentItem;
}

function findSection(item: PortalContentItem, keyword: string): string | undefined {
  return item.sections.find((section) => section.heading.includes(keyword))?.body;
}

function toList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function buildPrompt(item: PortalContentItem): string {
  const scenario = findSection(item, '适用') ?? item.description;
  const workflow = findSection(item, '流程') ?? item.sections.map((section) => `${section.heading}: ${section.body}`).join('\n');
  const acceptance = findSection(item, '验收') ?? '输出必须结构清晰、可复核、可直接进入下一步工作。';

  return `你是「${item.title}」。

你的任务：
${item.agent.purpose}

适用场景：
${scenario}

输入资料：
${toList(item.agent.inputs)}

执行流程：
${workflow}

输出格式：
${toList(item.agent.outputs)}

验收标准：
${acceptance}

请先确认输入资料是否足够；如果缺少关键信息，先列出需要补充的问题。资料足够后，直接给出可交付结果，并在最后附上一段「如何复用本 Skill」的简短说明。`;
}

function buildExampleInput(item: PortalContentItem): string {
  const inputLines = item.agent.inputs.map((input) => `${input}: 请在这里填写具体内容`);
  return inputLines.join('\n');
}

export function SkillDocument({ item }: SkillDocumentProps) {
  const [copied, setCopied] = useState(false);
  const prompt = useMemo(() => buildPrompt(item), [item]);
  const exampleInput = useMemo(() => buildExampleInput(item), [item]);
  const scenario = findSection(item, '适用') ?? item.description;
  const workflow = findSection(item, '流程');
  const acceptance = findSection(item, '验收');

  async function copyPrompt(): Promise<void> {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div id="skill-document" className="overflow-hidden rounded-lg border border-[#c9d8ff] bg-white shadow-sm shadow-[#0A04AE]/5">
      <div className="border-b border-[#d8e4ff] bg-[#f5f8ff] px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#0A04AE] shadow-sm">
              <FileText className="h-3.5 w-3.5" />
              SKILL.md
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">{item.title}</h2>
            <p className="mt-2 max-w-[760px] text-sm leading-6 text-[#52637A]">{item.description}</p>
          </div>
          <button
            type="button"
            onClick={copyPrompt}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#0A04AE] px-4 text-sm font-bold text-white transition hover:bg-[#08038f]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? '已复制' : '复制 Skill Prompt'}
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#edf2ff]">
        <section className="px-5 py-6">
          <h3 className="text-lg font-bold text-slate-950">什么时候用</h3>
          <p className="mt-3 text-sm leading-7 text-[#52637A]">{scenario}</p>
        </section>

        <section className="grid gap-5 px-5 py-6 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <ListChecks className="h-5 w-5 text-[#0A04AE]" />
              输入资料
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#52637A]">
              {item.agent.inputs.map((input) => (
                <li key={input} className="rounded-md bg-[#f8fbff] px-3 py-2">
                  {input}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950">输出结果</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#52637A]">
              {item.agent.outputs.map((output) => (
                <li key={output} className="rounded-md bg-[#f8fbff] px-3 py-2">
                  {output}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-5 py-6">
          <h3 className="text-lg font-bold text-slate-950">执行流程</h3>
          <p className="mt-3 text-sm leading-7 text-[#52637A]">
            {workflow ?? item.sections.map((section) => `${section.heading}：${section.body}`).join(' ')}
          </p>
        </section>

        <section className="px-5 py-6">
          <h3 className="text-lg font-bold text-slate-950">验收标准</h3>
          <p className="mt-3 text-sm leading-7 text-[#52637A]">
            {acceptance ?? '结果应该能被业务同事直接阅读、复核和继续加工，不能只停留在泛泛建议。'}
          </p>
        </section>

        <section className="px-5 py-6">
          <h3 className="text-lg font-bold text-slate-950">示例输入</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
            <code>{exampleInput}</code>
          </pre>
        </section>

        <section className="px-5 py-6">
          <h3 className="text-lg font-bold text-slate-950">可复制 Skill Prompt</h3>
          <pre className="mt-3 max-h-[520px] overflow-auto rounded-lg bg-[#071b3d] p-4 text-sm leading-6 text-slate-100">
            <code>{prompt}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
