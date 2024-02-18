const fs = require('fs').promises;

(async () => {
  try {
    const jsonContent = await fs.readFile('./change-log.json');
    const data = JSON.parse(jsonContent);
    
    const cards = data.data.search.edges[0].node.project.columns.edges[0].node.cards.edges;

    const prCards = cards.filter(card => card.node.content.url && card.node.content.merged);
    const prCount = prCards.length;
    
    let changelog = `${prCount} PRs found!\n\n`;
    
    prCards.forEach(card => {
      const { title, url, author, participants } = card.node.content;
      changelog += `- [${title}](${url}) (@${author.login})\n`;
      changelog += `  participants: (${participants.edges.map(p => ` @${p.node.login}`)})\n\n`;
    });

    await fs.writeFile('./change-log.txt', changelog);
    console.log('change-log.txt updated');
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
