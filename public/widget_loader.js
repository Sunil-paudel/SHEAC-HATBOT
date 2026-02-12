(function () {
    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-domain.com/widget.html';
    iframe.style.cssText = 'position:fixed;bottom:20px;right:20px;width:350px;height:500px;border:none;z-index:9999;display:none;';
    iframe.id = 'sheabot-widget';

    // Create toggle button
    var button = document.createElement('button');
    button.innerHTML = '💬';
    button.style.cssText = 'position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:#007bff;color:white;border:none;font-size:24px;cursor:pointer;z-index:10000;';

    // Toggle functionality
    button.onclick = function () {
        var widget = document.getElementById('sheabot-widget');
        widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
    };

    // Append to body
    document.body.appendChild(iframe);
    document.body.appendChild(button);
})();