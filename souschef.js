const chef = require("cyberchef");
const yargs = require('yargs');
const fs = require('fs');

function parseJSON (recipeFilePath) {
  var data = fs.readFileSync(recipeFilePath, 'utf8');
  return JSON.parse(data);
}

const argv = yargs
  .command('socket', 'stdin | souschef <-- TCP --> ip:port', {
    ip: {
        description: 'destination ip or domain',
        type: 'string',
    },
    port: {
        description: 'destination port',
        type: 'string',
    },
    out: {
        description: 'file path to outbound recipe .json',
        type: 'string',
    },
    in: {
        description: 'file path to inbound recipe .json',
        type: 'string',
    },
    mode: {
        description: 'verbose on',
        alias: 'v',    
        type: 'bool',
    }
  })

  .command('core', 'stdin | souschef | stdout', {
    recipe: {
        description: 'file path to recipe .json',
        alias: 'r',    
        type: 'string',
    },
    mode: {
        description: 'verbose on',
        alias: 'v',    
        type: 'bool',
    }

  })

  .help()
  .alias('help', 'h')
  .argv;

if (argv._.includes('core')) {
   if (!argv.recipe) {
      console.log("Error: Your souschef doesn't have the recipe!!");
      process.exit(1);
   }
   if (!argv.v) {
      const recipe = parseJSON(argv.recipe);
      process.stdin.on('readable', () => {
        var input = process.stdin.read();
        if (input !== null) {
          process.stdout.write(chef.bake(input, recipe).toString());
        }
      }); 
   }
   else {
    const recipe = parseJSON(argv.recipe);
    console.log('loaded recipe: ');
    console.log(recipe);
    process.stdin.on('readable', () => {
      var input = process.stdin.read();
      if (input !== null) {
        console.log('stdin: ');
        console.log(input + '\n');
        console.log('stdout: ');  
        process.stdout.write(chef.bake(input, recipe).toString());
      }
    }); 
  }
}

else if (argv._.includes('socket')) {
  if (argv.in == '' || argv.ip == '' || argv.port == '' || argv.out == '') {
    console.log('Error: Your souschef does not have the recipes (in out) or delivery address (ip,port)!!');
    process.exit(1);
  }
  if (!argv.v) {
    var net = require('net');
    const outrecipe = parseJSON(argv.out);
    const inrecipe = parseJSON(argv.in);

    var client = new net.Socket();
    client.connect(argv.port, argv.ip, function() {
    });

    process.stdin.on('readable', () => {
      var input = process.stdin.read();
      if (input !== null) {
        client.write(chef.bake(input, outrecipe).toString());
      }
    }); 

    client.on('data', function(data) {
      process.stdout.write(chef.bake(data, inrecipe).toString());
    });

    client.on('close', function() {
      client.destroy();
    });
  }
  else {
    var net = require('net');
    const outrecipe = parseJSON(argv.out);
    const inrecipe = parseJSON(argv.in);

    var client = new net.Socket();
    client.connect(argv.port, argv.ip, function() {
      console.log('Connected: ' + argv.ip + ':' + argv.port);
    });

    process.stdin.on('readable', () => {
      var input = process.stdin.read();
      if (input !== null) {
        client.write(chef.bake(input, outrecipe).toString());
      }
    }); 

    client.on('data', function(data) {
      console.log('recv:');
      process.stdout.write(chef.bake(data, inrecipe).toString());
    });

    client.on('close', function() {
      console.log('Connection closed.');
      client.destroy();
    });
  }
}
else {
  console.log('The kitchen is closed..')
}
