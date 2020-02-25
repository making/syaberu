# Syaberu

A proxy server for [VoiceText Web API](https://cloud.voicetext.jp/webapi).

```
curl localhost:8080 -H "X-Api-Key: ****" -d text=10:30になりました。スタンドアプミーティングを終了してください。
curl localhost:8080 -H "X-Api-Key: ****" -d text=ビルドが失敗しました。直してください 。 -d speaker=hikari -d emotion=sadness
curl localhost:8080 -H "X-Api-Key: ****" -d text=18:00になりました。帰宅の準備をしてください。 -d speaker=haruka -d emotion=happiness
```