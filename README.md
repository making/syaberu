# Syaberu

A proxy server for [VoiceText Web API](https://cloud.voicetext.jp/webapi).

Download latest from [repository](https://oss.sonatype.org/content/repositories/snapshots/am/ik/lab/syaberu-server/0.0.1-SNAPSHOT/) 

```
java -jar syaberu-*.jar
```

```
curl localhost:8080 -H "X-Api-Key: ****" -d text=10:30になりました。スタンドアプミーティングを終了してください。
curl localhost:8080 -H "X-Api-Key: ****" -d text=ビルドが失敗しました。直してください 。 -d speaker=hikari -d emotion=sadness
curl localhost:8080 -H "X-Api-Key: ****" -d text=18:00になりました。帰宅の準備をしてください。 -d speaker=haruka -d emotion=happiness
```

Call API via [Syaberu RSocket Proxy](https://github.com/making/syaberu-rsocket-proxy)

```
java -jar syaberu-*.jar --syaberu.proxy-uri=https://syaberu-rsocket-proxy.cfapps.io:8443/rsocket --syaberu.proxy-subscription-id=foo 

curl https://syaberu-rsocket-proxy.cfapps.io:8443/proxy/foo -H "X-Api-Key: ****" -d text=10:30になりました。スタンドアプミーティングを終了してください。
```