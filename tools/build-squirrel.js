// NB: Use this syntax within an async function, Node does not have support for
//     top-level await as of Node 12.
// https://github.com/electron/windows-installer
try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: '/tmp/build/my-app-64',
      outputDirectory: '/tmp/build/installer64',
      authors: 'My App Inc.',
      exe: 'myapp.exe'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
