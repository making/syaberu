package am.ik.lab.syaberu;

import am.ik.voicetext4j.*;
import org.springframework.util.StringUtils;

import java.util.concurrent.CompletableFuture;

public class Syaberu {
    public static final String SHOW = "SHOW";

    public static CompletableFuture<?> speak(String apiKey,
                                             String text,
                                             String speaker,
                                             String emotion) throws InterruptedException {
        VoiceContext<?> voiceContext;
        if (StringUtils.isEmpty(speaker) || "null".equalsIgnoreCase(speaker) /* TO BE FIXED */ || SHOW.equalsIgnoreCase(speaker)) {
            voiceContext = Speaker.SHOW.ready();
        } else {
            EmotionalVoiceContext context = EmotionalSpeaker.valueOf(speaker.toUpperCase()).ready();
            if (!StringUtils.isEmpty(emotion) && !"null".equalsIgnoreCase(emotion) /* TO BE FIXED */) {
                context = context.emotion(Emotion.valueOf(emotion.toUpperCase()), Emotion.Level.HIGH);
            }
            voiceContext = context;
        }
        return voiceContext.speak(text, apiKey);
    }
}
