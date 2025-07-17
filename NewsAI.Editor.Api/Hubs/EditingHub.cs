using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace NewsAI.Editor.Api.Hubs;

public class EditingHub : Hub
{
    private static readonly string[] Steps = new[]
    {
        "Analyzing script",
        "Transcribing media files",
        "Matching content to script",
        "Generating timeline",
        "Processing audio"
    };

    private static readonly ConcurrentDictionary<string, CancellationTokenSource> _tokens = new();

    public async Task StartEditing()
    {
        var cts = new CancellationTokenSource();
        _tokens[Context.ConnectionId] = cts;

        for (var i = 0; i < Steps.Length; i++)
        {
            if (cts.IsCancellationRequested) break;

            for (var p = 0; p <= 100; p += 20)
            {
                if (cts.IsCancellationRequested) break;
                await Clients.Caller.SendAsync("ProgressUpdate", new
                {
                    step = Steps[i],
                    percent = (i * 100 / Steps.Length) + p / Steps.Length,
                    details = string.Empty
                });
                await Task.Delay(500, cts.Token).ContinueWith(_ => { });
            }
        }

        if (!cts.IsCancellationRequested)
        {
            await Clients.Caller.SendAsync("ProcessingComplete");
        }
        _tokens.TryRemove(Context.ConnectionId, out _);
    }

    public Task CancelEditing()
    {
        if (_tokens.TryRemove(Context.ConnectionId, out var cts))
        {
            cts.Cancel();
        }
        return Task.CompletedTask;
    }
}
