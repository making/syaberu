package am.ik.lab.syaberu;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import java.net.URI;

@ConfigurationProperties(prefix = "syaberu")
public class SyaberuProps {
    private final URI proxyUri;
    private final String proxySubscriptionId;
    private final URI httpProxy;

    @ConstructorBinding
    public SyaberuProps(URI proxyUri, String proxySubscriptionId, URI httpProxy) {
        this.proxyUri = proxyUri;
        this.proxySubscriptionId = proxySubscriptionId;
        this.httpProxy = httpProxy;
    }

    public URI getProxyUri() {
        return proxyUri;
    }

    public String getProxySubscriptionId() {
        return proxySubscriptionId;
    }

    public URI getHttpProxy() {
        return httpProxy;
    }
}
