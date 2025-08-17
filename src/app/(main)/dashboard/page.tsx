import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { kpiData, journeyData, healthPillars } from "@/lib/data";
import { monthlyJourney } from "@/lib/monthwise-data";
import { DashboardChart } from "@/components/dashboard-chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wand } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const parseMonthlyJourney = (journeyString: string) => {
  const episodes = journeyString.trim().split(/(?=Episode:|Episode –|Episode X:|Travel Adaptation, Recovery, and Continuity|Episode 7 –)/).filter(ep => ep.trim().length > 0);
  
  return episodes.map(episode => {
    const lines = episode.trim().split('\n');
    let title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    
    const monthMatch = title.match(/(January|February|March|April|May|June|July|August|September|October|November|December|\(May|Aug|Sept)/i);
    let monthName = monthMatch ? monthMatch[0] : "";

    if (monthName.startsWith('(')) {
      monthName = monthName.substring(1);
    }
    if (monthName.toLowerCase() === 'aug') monthName = 'August';
    if (monthName.toLowerCase() === 'sept') monthName = 'September';


    const sections: { [key: string]: string } = {};
    const sectionRegex = /^(Primary Goal \/ Trigger|Friction Points|Final Outcome|Stateful Persona Analysis|What Happened|Decisions Made|Triggered by Whom|Episode Takeaway|● Primary Goal\/Trigger|● Triggered by Whom|● Friction Points|● Final Outcome|● Stateful Persona Analysis|Primary Goal\/Trigger|Triggered by Whom|Reasoning|Diagnostics & Preparations|Training & Performance Cycles|Recovery & Wearable Insights|Nutrition Strategy|Comprehensive Testing & Results|Closing Reflections & Transition|Primary Goal|Friction Points|Final Outcome|Stateful Persona Analysis|What Happened|Decisions Made|Triggered by Whom|Episode Takeaway|Diagnostics & Preparations|Training & Performance Cycles|Recovery & Wearable Insights|Nutrition Strategy|Comprehensive Testing & Results|Closing Reflections & Transition)/im;
    
    const contentParts = content.split(sectionRegex);

    for (let i = 1; i < contentParts.length; i += 2) {
      const sectionTitle = contentParts[i].replace(/[●:]/g, '').trim();
      const sectionContent = contentParts[i+1]?.trim().split('\n').map(line => line.replace(/^• /, '')).join('\n') || '';
      sections[sectionTitle] = sectionContent;
    }

    return { title: monthName, fullTitle: title, sections };
  }).filter(j => j.title && Object.keys(j.sections).length > 0);
};


export default function DashboardPage() {

  const parsedJourney = parseMonthlyJourney(monthlyJourney);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-headline text-2xl md:text-3xl font-semibold">
          Rohan's 8-Month Health Journey
        </h1>
        <Button asChild>
            <Link href="/chat">
                <Wand className="mr-2" />
                Analyze Conversation
            </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}{kpi.unit}</div>
                {kpi.name === "Plan Adherence" && <p className="text-xs text-muted-foreground">across all health pillars</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Health Pillar Progress</CardTitle>
            <CardDescription>
              Scores evolution over the 8-month program.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[400px]">
            <DashboardChart data={journeyData} pillars={healthPillars} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Journey</CardTitle>
            <CardDescription>
              A summary of goals, friction points, and outcomes for each month.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
              {parsedJourney.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-base">{item.fullTitle}</h3>
                      {Object.entries(item.sections).map(([key, value]) => (
                        value && <div key={key}>
                          <h4 className="font-semibold mb-1">{key}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{value}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
    </main>
  );
}
