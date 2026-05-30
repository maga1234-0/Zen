/**
 * Script de test pour vérifier si le backend spa est déployé
 * Usage: node test-spa-backend.js <BACKEND_URL>
 * Exemple: node test-spa-backend.js https://zen-backend-xxxx.onrender.com
 */

const https = require('https');
const http = require('http');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests(baseUrl) {
  log('\n🔍 TEST DU BACKEND SPA\n', 'cyan');
  log(`URL de base: ${baseUrl}\n`, 'blue');
  
  const tests = [
    { name: 'Health Check', endpoint: '/api/health', expected: 200 },
    { name: 'Spa Services', endpoint: '/api/spa/services', expected: 200 },
    { name: 'Spa Bookings', endpoint: '/api/spa/bookings', expected: 401 }, // 401 car pas de token
    { name: 'Spa Therapists', endpoint: '/api/spa/therapists', expected: 401 },
    { name: 'Spa Categories', endpoint: '/api/spa/categories', expected: 401 }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const url = `${baseUrl}${test.endpoint}`;
    log(`Testing: ${test.name}`, 'yellow');
    log(`  URL: ${url}`);
    
    try {
      const result = await testEndpoint(url);
      
      if (result.status === test.expected || (test.expected === 401 && result.status === 401)) {
        log(`  ✅ PASS - Status: ${result.status}`, 'green');
        passed++;
        
        // Afficher les données pour les endpoints publics
        if (result.status === 200 && result.data) {
          try {
            const json = JSON.parse(result.data);
            log(`  Data: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch (e) {
            log(`  Data: ${result.data.substring(0, 100)}...`);
          }
        }
      } else if (result.status === 404) {
        log(`  ❌ FAIL - 404 Not Found (routes spa non déployées)`, 'red');
        failed++;
      } else {
        log(`  ⚠️  WARN - Status: ${result.status} (attendu: ${test.expected})`, 'yellow');
        failed++;
      }
    } catch (error) {
      log(`  ❌ ERROR - ${error.message}`, 'red');
      failed++;
    }
    
    log(''); // Ligne vide
  }
  
  // Résumé
  log('\n' + '='.repeat(50), 'cyan');
  log('RÉSUMÉ DES TESTS', 'cyan');
  log('='.repeat(50), 'cyan');
  log(`✅ Tests réussis: ${passed}`, 'green');
  log(`❌ Tests échoués: ${failed}`, 'red');
  log(`📊 Total: ${tests.length}`, 'blue');
  
  if (failed === 0) {
    log('\n🎉 TOUS LES TESTS SONT PASSÉS!', 'green');
    log('Le backend spa est correctement déployé.', 'green');
  } else {
    log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
    
    if (tests.some(t => t.endpoint.includes('/spa/') && failed > 0)) {
      log('\n💡 SOLUTION:', 'cyan');
      log('1. Ouvrir Render Dashboard', 'yellow');
      log('2. Sélectionner votre service backend', 'yellow');
      log('3. Cliquer "Manual Deploy" → "Clear build cache & deploy"', 'yellow');
      log('4. Attendre 5-10 minutes', 'yellow');
      log('5. Relancer ce script', 'yellow');
    }
  }
  
  log('');
}

// Récupérer l'URL depuis les arguments
const backendUrl = process.argv[2];

if (!backendUrl) {
  log('❌ ERREUR: URL du backend manquante', 'red');
  log('\nUsage: node test-spa-backend.js <BACKEND_URL>', 'yellow');
  log('Exemple: node test-spa-backend.js https://zen-backend-xxxx.onrender.com', 'yellow');
  process.exit(1);
}

// Nettoyer l'URL (enlever le trailing slash)
const cleanUrl = backendUrl.replace(/\/$/, '');

// Lancer les tests
runTests(cleanUrl).catch(error => {
  log(`\n❌ ERREUR FATALE: ${error.message}`, 'red');
  process.exit(1);
});
