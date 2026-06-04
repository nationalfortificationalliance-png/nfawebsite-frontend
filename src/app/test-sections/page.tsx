export default function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ background: 'red', padding: '50px', marginBottom: '20px' }}>
        <h1>TEST SECTION 1 - RED</h1>
        <p>If you can see this, sections are rendering</p>
      </div>

      <div style={{ background: 'blue', padding: '50px', marginBottom: '20px', color: 'white' }}>
        <h1>TEST SECTION 2 - BLUE</h1>
        <p>Scroll down to see more sections</p>
      </div>

      <div style={{ background: 'green', padding: '50px', marginBottom: '20px', color: 'white' }}>
        <h1>TEST SECTION 3 - GREEN</h1>
        <p>All sections should be visible</p>
      </div>

      <div style={{ background: 'yellow', padding: '50px', marginBottom: '20px' }}>
        <h1>TEST SECTION 4 - YELLOW</h1>
        <p>This is the last test section</p>
      </div>
    </div>
  );
}
