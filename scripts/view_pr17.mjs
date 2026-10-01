async function viewPR() {
  const url = "https://api.github.com/repos/anoirqotbi87-debug/kenza/pulls/17";
  const res = await fetch(url, {
    headers: { "User-Agent": "Antigravity-Agent" }
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Title:", data.title);
  console.log("State:", data.state);
  console.log("Mergeable:", data.mergeable);
  console.log("Head:", data.head?.ref);
  console.log("Changed files:", data.changed_files);
}

viewPR().catch(console.error);
