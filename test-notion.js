const { Client } = require('@notionhq/client');

const config = require('./config/notion-config.json');

const notion = new Client({ auth: config.apiKey });

async function test() {
  console.log('Testing with API key:', config.apiKey.substring(0, 20) + '...');
  console.log('Database ID:', config.accountTrackerDatabaseId);

  try {
    console.log('\n1. Testing database retrieval...');
    const db = await notion.databases.retrieve({
      database_id: config.accountTrackerDatabaseId
    });
    console.log('✅ Database found:', db.title[0]?.plain_text);
  } catch (error) {
    console.log('❌ Database retrieval failed:');
    console.log('   Status:', error.status);
    console.log('   Code:', error.code);
    console.log('   Message:', error.message);
    console.log('   Full error:', JSON.stringify(error, null, 2));
  }

  try {
    console.log('\n2. Testing page creation...');
    const page = await notion.pages.create({
      parent: { database_id: config.accountTrackerDatabaseId },
      properties: {
        'Account Name': {
          title: [{ text: { content: 'Test Account' } }]
        },
        'Date': {
          date: { start: '2025-11-08' }
        },
        'Balance': {
          number: -1000
        },
        'Type': {
          select: { name: 'Credit Card' }
        },
        'Category': {
          select: { name: 'Debt' }
        },
        'Change from Last Month': {
          number: null
        }
      }
    });
    console.log('✅ Page created successfully:', page.id);
  } catch (error) {
    console.log('❌ Page creation failed:');
    console.log('   Status:', error.status);
    console.log('   Code:', error.code);
    console.log('   Message:', error.message);
  }
}

test();
