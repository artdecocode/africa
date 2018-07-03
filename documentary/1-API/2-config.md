
### `AfricaConfig` Type

Any additional functionality can be configured via the config object.

%TYPE true
<p name="force" type="boolean">
  <d>Ask questions and update the configuration file even if it already exists. Default <code>false</code>.</d>
  <e><code>true</code></e>
</p>
<p name="homedir" type="string">
  <d>In which directory to save and search for configuration file. Default <code>os.homedir()</code>.</d>
  <e><code>resolve('..')</code></e>
</p>
<p name="questionsTimeout" type="number">
  <d>How log to wait in ms before timing out. Will wait forever by default.</d>
  <e><code>10000</code></e>
</p>
<p name="rcNameFunction" type="function">
  <d>Function used to generate the rc name. Default <code>packageName => `.${packageName}rc`</code>.</d>
  <e>To save as JSON: <code>packageName => `${packageName}.json`</code></e>
</p>
%
