import AIAssistClient from "@/components/AIAssistClient";

export const metadata = {
  title: "AI Assist | MUERA",
  description: "Get smart suggestions for your perfect made-to-measure suit with our AI Style Assistant.",
};

export default function AIAssistPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: "120px", background: "white", minHeight: "calc(100vh - 80px)" }}>
        <AIAssistClient />
      </section>
    </>
  );
}
