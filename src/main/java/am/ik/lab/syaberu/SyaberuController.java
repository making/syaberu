package am.ik.lab.syaberu;

import am.ik.voicetext4j.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
public class SyaberuController {
    public static final String SHOW = "SHOW";

    @PostMapping
    public CompletableFuture<?> syaberu(@RequestHeader(name = "X-Api-Key") String apiKey,
                                        @RequestParam(name = "text") String text,
                                        @RequestParam(name = "speaker", required = false, defaultValue = SHOW) String speaker,
                                        @RequestParam(name = "emotion", required = false) String emotion
    ) throws Exception {
        VoiceContext<?> voiceContext;
        if (SHOW.equalsIgnoreCase(speaker)) {
            voiceContext = Speaker.SHOW.ready();
        } else {
            EmotionalVoiceContext context = EmotionalSpeaker.valueOf(speaker.toUpperCase()).ready();
            if (emotion != null) {
                context = context.emotion(Emotion.valueOf(emotion.toUpperCase()), Emotion.Level.HIGH);
            }
            voiceContext = context;
        }
        return voiceContext.speak(text, apiKey);
    }
}
