export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">SketchUp Playstore</h1>
      <ul className="list-disc ml-6">
        <li><a className="underline" href="/admin">Admin</a></li>
        <li><a className="underline" href="/designer">Designer</a></li>
        <li><a className="underline" href="/client">Client</a></li>
      </ul>
    </main>
  );
}
